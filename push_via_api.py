#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""通过 GitHub git 数据 API 推送本地 main 提交 (代理只放行 api.github.com 时的备用通道)。

流程: 对比本地 HEAD 与远端 main → 逐文件建 blob (含 base64 二进制) →
建 tree → 建 commit → update refs/heads/main。
用法: python push_via_api.py [本地提交sha]  (缺省 HEAD)
"""
import json
import subprocess
import sys
import urllib.request
import base64
import os

# token 从环境变量 GOX_UI_TOKEN 读 (勿硬编码 —— GitHub push 保护会拦截 secret)
TOKEN = os.environ.get("GOX_UI_TOKEN", "")
if not TOKEN:
    print("set GOX_UI_TOKEN=<fine-grained token> first")
    sys.exit(2)
OWNER, REPO = "14752222", "gox-ui"
API = f"https://api.github.com/repos/{OWNER}/{REPO}"
ROOT = os.path.dirname(os.path.abspath(__file__))


def api_call(method, url, body=None, expect=200):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("User-Agent", "gox-ui-push")
    if data:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read() or b"{}")


def main():
    local_sha = sys.argv[1] if len(sys.argv) > 1 else subprocess.run(
        ["git", "rev-parse", "HEAD"], capture_output=True, text=True, cwd=ROOT).stdout.strip()
    print("local HEAD:", local_sha[:12])

    # 远端 main
    st, ref = api_call("GET", f"{API}/git/ref/heads/main")
    if st != 200:
        print("no remote main:", ref); return 1
    remote_sha = ref["object"]["sha"]
    print("remote main:", remote_sha[:12])
    if remote_sha == local_sha:
        print("already up to date"); return 0

    # 待推送文件 = 本地 HEAD 与远端 sha 的差异; 若远端 sha 不在本地历史 (不可能, 单人仓库), 退全量
    diff = subprocess.run(["git", "diff", "--name-only", remote_sha, local_sha],
                          capture_output=True, text=True, cwd=ROOT)
    paths = [p for p in diff.stdout.splitlines() if p.strip()]
    if not paths:
        print("diff empty — nothing to push"); return 0
    print(f"changed files: {len(paths)}")

    # 逐文件建 blob
    tree_items = []
    for p in paths:
        full = os.path.join(ROOT, p.replace("/", os.sep))
        # 用 git cat-file 读 blob (保证与 git 对象一致, 不受工作区改动影响)
        blob_sha = subprocess.run(["git", "rev-parse", f"{local_sha}:{p}"],
                                  capture_output=True, text=True, cwd=ROOT).stdout.strip()
        if not blob_sha:
            print("skip (deleted?):", p); continue
        # mode: 可执行文件 100755, 其余 100644
        ls = subprocess.run(["git", "ls-tree", local_sha, p],
                            capture_output=True, text=True, cwd=ROOT).stdout.split()
        mode = ls[0] if ls and ls[0] in ("100644", "100755") else "100644"
        tree_items.append({"path": p, "mode": mode, "type": "blob", "sha": blob_sha})

    # blob 对象若远端没有, 需要 push-object (新 API) 或逐个 contents PUT。
    # 稳妥路线: 检查每个 blob 是否远端已有; 缺的用 Git Data API 的 blob 建不了
    # (POST /git/blobs 只收 content, 不收 sha) —— 用 contents API 逐文件 PUT。
    missing = []
    for it in tree_items:
        st, _ = api_call("GET", f"{API}/git/blobs/{it['sha']}")
        if st != 200:
            missing.append(it)
    print(f"remote-missing blobs: {len(missing)}")

    for it in missing:
        p = it["path"]
        content = subprocess.run(["git", "show", f"{local_sha}:{p}"],
                                 capture_output=True, cwd=ROOT).stdout
        b64 = base64.b64encode(content).decode()
        st, cur = api_call("GET", f"{API}/contents/{p}?ref=main")
        body = {
            "message": f"blob: {p}",
            "content": b64,
            "branch": "main",
        }
        if st == 200 and "sha" in cur:
            body["sha"] = cur["sha"]
        st, res = api_call("PUT", f"{API}/contents/{p}", body)
        ok = st in (200, 201)
        print(("OK  " if ok else "ERR ") + p, st if not ok else "")
        if not ok:
            print(json.dumps(res, ensure_ascii=False)[:300]); return 1

    # 全部 blob 在位后建 tree + commit + ref
    st, base_commit = api_call("GET", f"{API}/git/commits/{remote_sha}")
    if st != 200:
        print("get base commit failed"); return 1
    st, tree = api_call("POST", f"{API}/git/trees",
                        {"base_tree": base_commit["tree"]["sha"], "tree": tree_items})
    if st != 201:
        print("create tree failed", tree); return 1
    msg = subprocess.run(["git", "log", "-1", "--pretty=%B", local_sha],
                         capture_output=True, text=True, cwd=ROOT).stdout.strip()
    st, commit = api_call("POST", f"{API}/git/commits",
                          {"message": msg, "tree": tree["sha"], "parents": [remote_sha]})
    if st != 201:
        print("create commit failed", commit); return 1
    st, res = api_call("PATCH", f"{API}/git/refs/heads/main",
                       {"sha": commit["sha"], "force": False})
    if st != 200:
        print("update ref failed", res); return 1
    print("pushed via API:", commit["sha"][:12])
    return 0


if __name__ == "__main__":
    sys.exit(main())
