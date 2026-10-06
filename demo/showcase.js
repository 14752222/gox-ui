// GoxUI 组件全家福 showcase
// 运行: gox demo/showcase.js
//
// 注意: import 路径写相对路径 (node_modules 场景下会解析到包内),
// 本地开发时与 src/ 同仓。

import { h, render } from "gx/gfx";
import { createSignal } from "gx/solid";

import {
  GxButton, GxButtonGroup, GxInput, GxSwitch, GxCheckboxGroup, GxSelect,
  GxSlider, GxRate, GxIcon, GxSpace, GxDivider, GxCard, GxCollapse,
  GxBreadcrumb, GxSteps, GxTabs, GxTabPane, GxPagination,
  GxTable, GxTag, GxAvatar, GxDescriptions, GxTimeline, GxResult, GxEmpty,
  GxDialog, GxAlert, GxMessage, GxMessageHost, GxProgress, GxTooltip,
  GxForm, GxFormItem, GxLoadingHost, useLoading,
} from "../src/index.js";

// ---- 应用状态 ----
const [dialogOpen, setDialogOpen] = createSignal(false);
const [progress, setProgress] = createSignal(20);
const [activeStep, setActiveStep] = createSignal(1);
const [tab, setTab] = createSignal(0);
const [page, setPage] = createSignal(1);
const [score, setScore] = createSignal(3);
const [hobby, setHobby] = createSignal(["code"]);
const [city, setCity] = createSignal("");
const [name, setName] = createSignal("");
const [agree, setAgree] = createSignal(true);
const [loading, setLoading] = useLoading();

// ---- 页面 ----
render(
  <window title="GoxUI 组件库 Showcase" width={920} height={760}>
    <scroll>
      <column gap={24} padding={24} font={14}>

        {/* 面包屑 + 标题 */}
        <GxBreadcrumb items={[
          { label: "首页", onClick: () => GxMessage.info("回首页") },
          { label: "组件" },
          { label: "Showcase" },
        ]} />
        <text font={26} fontWeight={700}>GoxUI 组件库</text>
        <text font={13}>Element Plus 风格 · 基于 Gox gfx 内核 · 纯 ESM 函数组件</text>

        <GxDivider contentPosition="center">基础组件</GxDivider>

        {/* 按钮族 */}
        <GxCard header="GxButton 按钮">
          <row gap={10} wrap alignItems="center">
            <GxButton>Default</GxButton>
            <GxButton type="primary">Primary</GxButton>
            <GxButton type="success">Success</GxButton>
            <GxButton type="warning">Warning</GxButton>
            <GxButton type="danger">Danger</GxButton>
            <GxButton type="info">Info</GxButton>
          </row>
          <row gap={10} wrap alignItems="center">
            <GxButton plain type="primary">Plain</GxButton>
            <GxButton round type="primary">Round</GxButton>
            <GxButton type="primary" loading>loading</GxButton>
            <GxButton type="primary" disabled>Disabled</GxButton>
            <GxButton type="primary" text>Text</GxButton>
            <GxButton type="primary" icon="plus">图标</GxButton>
          </row>
          <row gap={10} alignItems="center">
            <GxButton size="large" type="primary">Large</GxButton>
            <GxButton size="default" type="primary">Default</GxButton>
            <GxButton size="small" type="primary">Small</GxButton>
          </row>
        </GxCard>

        {/* 输入族 */}
        <GxCard header="输入组件">
          <column gap={14}>
            <row gap={12} alignItems="center">
              <text font={13}>姓名:</text>
              <GxInput placeholder="请输入姓名" model={name} clearable />
              <GxTag type="primary">{() => name() ? `你好, ${name()}` : "未输入"}</GxTag>
            </row>
            <row gap={12} alignItems="center">
              <text font={13}>城市:</text>
              <GxSelect model={city} options={["北京", "上海", "深圳", "杭州"]} placeholder="选择城市" />
            </row>
            <row gap={12} alignItems="center">
              <text font={13}>爱好:</text>
              <GxCheckboxGroup options={["编码", "游戏", "旅行"]} value={() => hobby()} onChange={(e) => setHobby(e.value)} />
            </row>
            <row gap={12} alignItems="center">
              <text font={13}>评分:</text>
              <GxRate model={score} />
              <text font={12}>{() => `${score()} 星`}</text>
            </row>
            <row gap={12} alignItems="center">
              <text font={13}>同意条款:</text>
              <GxSwitch model={agree} />
            </row>
          </column>
        </GxCard>

        <GxDivider contentPosition="center">数据展示</GxDivider>

        {/* Tag 家族 */}
        <GxCard header="GxTag 标签">
          <row gap={8} wrap>
            <GxTag>Default</GxTag>
            <GxTag type="primary">Primary</GxTag>
            <GxTag type="success">Success</GxTag>
            <GxTag type="warning">Warning</GxTag>
            <GxTag type="danger">Danger</GxTag>
            <GxTag type="info">Info</GxTag>
            <GxTag type="primary" effect="dark">Dark</GxTag>
            <GxTag type="success" effect="plain">Plain</GxTag>
            <GxTag type="warning" closable onClose={() => GxMessage.warning("标签关闭")}>Closable</GxTag>
          </row>
        </GxCard>

        {/* 表格 */}
        <GxCard header="GxTable 表格">
          <GxTable
            columns={[
              { key: "name", label: "组件", width: 140 },
              { key: "cat", label: "分类" },
              { key: "status", label: "状态" },
            ]}
            rows={[
              { name: "GxButton", cat: "基础", status: "稳定" },
              { name: "GxTable", cat: "数据", status: "稳定" },
              { name: "GxTimeline", cat: "数据", status: "稳定" },
              { name: "GxResult", cat: "反馈", status: "稳定" },
            ]}
            onRowClick={(e) => GxMessage.info(`点击了 ${e.row.name}`)}
          />
        </GxCard>

        {/* 头像 + 描述 */}
        <GxCard header="GxAvatar / GxDescriptions">
          <row gap={20} alignItems="center">
            <row gap={8}>
              <GxAvatar name="G" />
              <GxAvatar name="X" color="#67c23aff" />
              <GxAvatar name="U" color="#e6a23cff" />
              <GxAvatar name="I" round={false} size={32} />
            </row>
          </row>
          <GxDescriptions column={2} title="库信息" items={[
            { label: "名称", content: "gox-ui" },
            { label: "版本", content: "0.1.0" },
            { label: "组件数", content: "30+" },
            { label: "内核", content: "gx/gfx" },
          ]} />
        </GxCard>

        {/* 时间线 */}
        <GxCard header="GxTimeline 时间线">
          <GxTimeline items={[
            { content: "创建仓库", timestamp: "2026-10-06", type: "primary" },
            { content: "基础组件完成", timestamp: "2026-10-06", type: "success" },
            { content: "发布 0.1.0", timestamp: "待定", type: "warning", hollow: true },
          ]} />
        </GxCard>

        <GxDivider contentPosition="center">反馈组件</GxDivider>

        {/* Alert */}
        <column gap={10}>
          <GxAlert type="success" title="成功创建 GoxUI 仓库" description="组件库已就绪, 可 gox add gox-ui 安装。" />
          <GxAlert type="warning" title="注意" closable onClose={() => GxMessage.info("关闭警告")} />
          <GxAlert type="danger" title="错误示例" />
          <GxAlert type="info" title="信息提示" />
        </column>

        {/* 进度条 */}
        <GxCard header="GxProgress 进度条">
          <GxProgress percentage={() => progress()} />
          <row gap={10}>
            <GxButton size="small" onClick={() => setProgress(Math.max(0, progress() - 10))}>-10</GxButton>
            <GxButton size="small" type="primary" onClick={() => setProgress(Math.min(100, progress() + 10))}>+10</GxButton>
          </row>
        </GxCard>

        {/* Steps */}
        <GxCard header="GxSteps 步骤条">
          <GxSteps
            steps={[{ title: "创建" }, { title: "开发" }, { title: "发布" }]}
            active={() => activeStep()}
            onChange={(e) => setActiveStep(e.step)}
          />
          <row gap={10}>
            <GxButton size="small" onClick={() => setActiveStep(Math.max(0, activeStep() - 1))}>上一步</GxButton>
            <GxButton size="small" type="primary" onClick={() => setActiveStep(Math.min(2, activeStep() + 1))}>下一步</GxButton>
          </row>
        </GxCard>

        {/* Tabs */}
        <GxCard header="GxTabs 选项卡">
          <GxTabs value={() => tab()} onChange={(e) => setTab(e.index)}>
            <GxTabPane title="概览">
              <text font={13}>GoxUI 是 Element Plus 风格的 Gox 组件库。</text>
            </GxTabPane>
            <GxTabPane title="组件">
              <GxEmpty description="组件清单见 README" />
            </GxTabPane>
            <GxTabPane title="空态">
              <GxResult icon="success" title="一切正常" subTitle="空态也好看" />
            </GxTabPane>
          </GxTabs>
        </GxCard>

        {/* 折叠面板 */}
        <GxCard header="GxCollapse 折叠面板">
          <GxCollapse items={[
            { title: "什么是 GoxUI?", content: [h("text", { font: 12 }, "基于 Gox gfx 内核的 Element Plus 风格组件库。")] },
            { title: "怎么安装?", content: [h("text", { font: 12 }, "gox add gox-ui")] },
          ]} />
        </GxCard>

        {/* 分页 */}
        <GxCard header="GxPagination 分页">
          <GxPagination total={42} current={() => page()} onChange={(e) => setPage(e.page)} />
          <text font={12}>{() => `当前第 ${page()} 页`}</text>
        </GxCard>

        {/* 弹层 */}
        <GxCard header="GxDialog / GxMessage / GxLoading">
          <row gap={10}>
            <GxButton type="primary" onClick={() => setDialogOpen(true)}>打开对话框</GxButton>
            <GxButton onClick={() => GxMessage.success("保存成功")}>成功消息</GxButton>
            <GxButton onClick={() => GxMessage.error("出错了")}>错误消息</GxButton>
            <GxButton loading={() => loading()} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}>
              模拟加载
            </GxButton>
          </row>
          <GxTooltip text="悬停看提示">
            <GxButton>悬停我</GxButton>
          </GxTooltip>
        </GxCard>

        {/* 表单 */}
        <GxCard header="GxForm 表单">
          <GxForm onSubmit={(e) => GxMessage.success(`提交: ${JSON.stringify(e.values)}`)}>
            <GxFormItem label="用户名" required>
              <GxInput name="username" placeholder="回车提交" />
            </GxFormItem>
            <GxFormItem label="备注">
              <GxInput name="note" placeholder="可选" />
            </GxFormItem>
          </GxForm>
        </GxCard>

        <text font={11}>— GoxUI 0.1.0 · Powered by Gox —</text>
      </column>

      {/* 全局弹层宿主 (消息/加载) — 挂在内容外层 */}
      <GxMessageHost />
      <GxLoadingHost />

      {/* 对话框 */}
      <GxDialog
        title="确认操作"
        open={() => dialogOpen()}
        onClose={() => setDialogOpen(false)}
        footer={() => (
          <row gap={8}>
            <GxButton onClick={() => setDialogOpen(false)}>取消</GxButton>
            <GxButton type="primary" onClick={() => { setDialogOpen(false); GxMessage.success("已确认"); }}>确定</GxButton>
          </row>
        )}
      >
        <text font={13}>这是一个 Element Plus 风格的对话框。</text>
        <text font={12}>点遮罩 / Esc / 右上角叉 都可关闭。</text>
      </GxDialog>
    </scroll>
  </window>
);
