// GoxUI 组件全家福 showcase —— 组件文档页版式
//
// 运行: gox demo/showcase.js
//
// 版式: 顶部渐变 hero (标题 + 副标题 + 元信息行), 下面按「基础 / 数据 /
// 反馈 / 导航」四个分区展开, 每个分区有编号小标 + 标题, 卡片栅格摆放。
// 注意: import 路径写相对路径 (node_modules 场景解析到包内)。

import { h, render } from "gx/gfx";
import { createSignal } from "gx/solid";

import {
  GxButton, GxButtonGroup, GxInput, GxSwitch, GxCheckboxGroup, GxSelect,
  GxSlider, GxRate, GxIcon, GxSpace, GxDivider, GxCard, GxCollapse,
  GxBreadcrumb, GxSteps, GxTabs, GxTabPane, GxPagination,
  GxTable, GxTag, GxAvatar, GxDescriptions, GxTimeline, GxResult, GxEmpty,
  GxDialog, GxAlert, GxMessage, GxMessageHost, GxProgress, GxTooltip,
  GxForm, GxFormItem, GxLoadingHost, useLoading,
  palette, space, radius,
} from "../src/index.js";

// ---- 应用状态 ----
const [dialogOpen, setDialogOpen] = createSignal(false);
const [progress, setProgress] = createSignal(45);
const [activeStep, setActiveStep] = createSignal(1);
const [tab, setTab] = createSignal(0);
const [page, setPage] = createSignal(1);
const [score, setScore] = createSignal(3);
const [hobby, setHobby] = createSignal(["code"]);
const [city, setCity] = createSignal("");
const [name, setName] = createSignal("");
const [agree, setAgree] = createSignal(true);
const [loading, setLoading] = useLoading();

const c = palette();

// 分区小标: "01 基础组件" 这种带编号的节标题
const sectionTitle = (num, title, subtitle) =>
  h("column", { gap: 2, marginTop: space["2xl"] }, [
    h("row", { gap: space.md, alignItems: "center" }, [
      h("text", { font: 12, fontWeight: 700, color: c.primary }, num),
      h("text", { font: 18, fontWeight: 600, color: c.textPrimary }, title),
    ]),
    subtitle ? h("text", { font: 12, color: c.textSecondary }, subtitle) : null,
  ]);

// 属性说明行: demo 卡片里的一行 (label + 内容)
const demoRow = (label, kids) =>
  h("row", { gap: space.lg, alignItems: "center", wrap: true }, [
    label ? h("text", { font: 12, color: c.textSecondary, width: 52 }, label) : null,
    ...kids,
  ]);

// ---- 页面 ----
render(
  <window title="GoxUI 组件库 Showcase" width={980} height={820}>
    <scroll>
      <column gap={0} font={14} alignItems="stretch" background={c.bgPage}>

        {/* ═══ Hero ═══ */}
        <column
          gap={space.md}
          padding={space["4xl"]}
          paddingBottom={space["3xl"]}
          background={() => `linear-gradient(to bottom, ${palette().primary}, ${palette().primaryLight5})`}
        >
          <column
            gap={space.md}
            bg="#ffffff26"
            radius={radius.lg}
            padding={space["2xl"]}
            border="#ffffff40"
          >
            <row gap={space.lg} alignItems="center">
              <row gap={space.xs} alignItems="center">
                <text font={26} fontWeight={700} color="#ffffffff">GoxUI</text>
                <column bg="#ffffff33" radius={radius.pill} padding={3} paddingLeft={10} paddingRight={10}>
                  <text font={11} fontWeight={600} color="#ffffffff">v0.2.0</text>
                </column>
              </row>
            </row>
            <text font={14} color="#fffffff2">Element Plus 风格 · 基于 Gox gfx 内核 · 纯 ESM 函数组件</text>
            <row gap={space.xl} alignItems="center" marginTop={space.xs}>
              <row gap={space.sm} alignItems="center">
                <text font={12} color="#ffffffcc">34 个组件</text>
              </row>
              <row gap={space.sm} alignItems="center">
                <text font={12} color="#ffffffcc">亮 / 暗双主题</text>
              </row>
              <row gap={space.sm} alignItems="center">
                <text font={12} color="#ffffffcc">4px 间距节奏</text>
              </row>
            </row>
          </column>
        </column>

        {/* ═══ 内容区 ═══ */}
        <column gap={0} padding={space["2xl"]} paddingTop={space.xl}>

          <GxBreadcrumb items={[
            { label: "首页", onClick: () => GxMessage.info("回首页") },
            { label: "组件" },
            { label: "Showcase" },
          ]} />

          {sectionTitle("01", "基础组件", "Button · Input · Select · Switch · Checkbox · Rate")}

          <GxCard header="GxButton 按钮" subtitle="type / size / plain / round / text / loading / icon">
            <column gap={space.lg}>
              {demoRow("类型", [
                <GxButton>Default</GxButton>,
                <GxButton type="primary">Primary</GxButton>,
                <GxButton type="success">Success</GxButton>,
                <GxButton type="warning">Warning</GxButton>,
                <GxButton type="danger">Danger</GxButton>,
                <GxButton type="info">Info</GxButton>,
              ])}
              {demoRow("形态", [
                <GxButton plain type="primary">Plain</GxButton>,
                <GxButton round type="primary">Round</GxButton>,
                <GxButton type="primary" loading>loading</GxButton>,
                <GxButton type="primary" disabled>Disabled</GxButton>,
                <GxButton type="primary" text>Text</GxButton>,
                <GxButton type="primary" icon="plus">图标</GxButton>,
              ])}
              {demoRow("尺寸", [
                <GxButton size="large" type="primary">Large 40</GxButton>,
                <GxButton size="default" type="primary">Default 32</GxButton>,
                <GxButton size="small" type="primary">Small 24</GxButton>,
              ])}
            </column>
          </GxCard>

          <GxCard header="输入组件" subtitle="Input · Select · Checkbox · Rate · Switch">
            <column gap={space.lg}>
              {demoRow("输入", [
                <GxInput placeholder="请输入姓名" model={name} clearable prefixIcon="user" />,
                <GxTag type="primary">{() => name() ? `你好, ${name()}` : "未输入"}</GxTag>,
              ])}
              {demoRow("选择", [
                <GxSelect model={city} options={["北京", "上海", "深圳", "杭州"]} placeholder="选择城市" />,
              ])}
              {demoRow("复选", [
                <GxCheckboxGroup options={["编码", "游戏", "旅行"]} value={() => hobby()} onChange={(e) => setHobby(e.value)} />,
              ])}
              {demoRow("评分", [
                <GxRate model={score} />,
                <text font={12} color={c.textSecondary}>{() => `${score()} 星`}</text>,
              ])}
              {demoRow("开关", [
                <text font={13} color={c.textRegular}>同意条款</text>,
                <GxSwitch model={agree} />,
              ])}
            </column>
          </GxCard>

          {sectionTitle("02", "数据展示", "Tag · Table · Avatar · Descriptions · Timeline · Result")}

          <GxCard header="GxTag 标签" subtitle="type / effect / closable">
            <row gap={space.md} wrap>
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

          <GxCard header="GxTable 表格" subtitle="columns / rows / zebra / onRowClick">
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

          <GxCard header="GxAvatar / GxDescriptions" subtitle="头像与键值描述列表">
            <column gap={space.xl}>
              <row gap={space.lg} alignItems="center">
                <GxAvatar name="G" />
                <GxAvatar name="X" color="#67c23aff" />
                <GxAvatar name="U" color="#e6a23cff" />
                <GxAvatar name="I" round={false} size={32} />
              </row>
              <GxDescriptions column={2} title="库信息" items={[
                { label: "名称", content: "gox-ui" },
                { label: "版本", content: "0.2.0" },
                { label: "组件数", content: "34" },
                { label: "内核", content: "gx/gfx" },
              ]} />
            </column>
          </GxCard>

          <GxCard header="GxTimeline 时间线" subtitle="type / hollow / timestamp">
            <GxTimeline items={[
              { content: "创建仓库", timestamp: "2026-10-06", type: "primary" },
              { content: "基础组件完成", timestamp: "2026-10-06", type: "success" },
              { content: "发布 0.2.0", timestamp: "待定", type: "warning", hollow: true },
            ]} />
          </GxCard>

          {sectionTitle("03", "反馈组件", "Alert · Progress · Steps · Tabs · Collapse · Dialog · Message")}

          <column gap={space.md} marginTop={space.xl}>
            <GxAlert type="success" title="成功创建 GoxUI 仓库" description="组件库已就绪, 可 gox add gox-ui 安装。" />
            <GxAlert type="warning" title="注意" closable onClose={() => GxMessage.info("关闭警告")} />
            <GxAlert type="danger" title="错误示例" />
            <GxAlert type="info" title="信息提示" />
          </column>

          <GxCard header="GxProgress 进度条" subtitle="percentage / status">
            <column gap={space.lg}>
              <GxProgress percentage={() => progress()} />
              <row gap={space.md}>
                <GxButton size="small" onClick={() => setProgress(Math.max(0, progress() - 10))}>-10</GxButton>
                <GxButton size="small" type="primary" onClick={() => setProgress(Math.min(100, progress() + 10))}>+10</GxButton>
              </row>
            </column>
          </GxCard>

          <GxCard header="GxSteps 步骤条" subtitle="steps / active">
            <column gap={space.lg}>
              <GxSteps
                steps={[{ title: "创建" }, { title: "开发" }, { title: "发布" }]}
                active={() => activeStep()}
                onChange={(e) => setActiveStep(e.step)}
              />
              <row gap={space.md}>
                <GxButton size="small" onClick={() => setActiveStep(Math.max(0, activeStep() - 1))}>上一步</GxButton>
                <GxButton size="small" type="primary" onClick={() => setActiveStep(Math.min(2, activeStep() + 1))}>下一步</GxButton>
              </row>
            </column>
          </GxCard>

          <GxCard header="GxTabs 选项卡 / GxCollapse 折叠面板">
            <column gap={space.xl}>
              <GxTabs value={() => tab()} onChange={(e) => setTab(e.index)}>
                <GxTabPane title="概览">
                  <text font={13} color={c.textRegular}>GoxUI 是 Element Plus 风格的 Gox 组件库。</text>
                </GxTabPane>
                <GxTabPane title="空态">
                  <GxEmpty description="组件清单见 README" size="compact" />
                </GxTabPane>
                <GxTabPane title="结果页">
                  <GxResult icon="success" title="一切正常" subTitle="空态也好看" />
                </GxTabPane>
              </GxTabs>
              <GxCollapse items={[
                { title: "什么是 GoxUI?", content: [h("text", { font: 12, color: c.textRegular }, "基于 Gox gfx 内核的 Element Plus 风格组件库, 纯 ESM 函数组件。")] },
                { title: "怎么安装?", content: [h("text", { font: 12, color: c.textRegular }, "gox add gox-ui")] },
              ]} />
            </column>
          </GxCard>

          <GxCard header="弹层与消息" subtitle="Dialog / Message / Loading / Tooltip">
            <row gap={space.md} wrap>
              <GxButton type="primary" onClick={() => setDialogOpen(true)}>打开对话框</GxButton>
              <GxButton onClick={() => GxMessage.success("保存成功")}>成功消息</GxButton>
              <GxButton onClick={() => GxMessage.error("出错了")}>错误消息</GxButton>
              <GxButton loading={() => loading()} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}>
                模拟加载
              </GxButton>
              <GxTooltip text="悬停看提示">
                <GxButton>悬停我</GxButton>
              </GxTooltip>
            </row>
          </GxCard>

          <GxCard header="GxForm 表单 / GxPagination 分页" subtitle="回车提交 · 分页切换">
            <column gap={space.xl}>
              <GxForm onSubmit={(e) => GxMessage.success(`提交: ${JSON.stringify(e.values)}`)}>
                <GxFormItem label="用户名" required>
                  <GxInput name="username" placeholder="回车提交" />
                </GxFormItem>
                <GxFormItem label="备注">
                  <GxInput name="note" placeholder="可选" />
                </GxFormItem>
              </GxForm>
              <row gap={space.lg} alignItems="center">
                <GxPagination total={42} current={() => page()} onChange={(e) => setPage(e.page)} />
                <text font={12} color={c.textSecondary}>{() => `当前第 ${page()} 页`}</text>
              </row>
            </column>
          </GxCard>

          {/* 页脚 */}
          <column alignItems="center" marginTop={space["2xl"]} marginBottom={space.xl}>
            <text font={11} color={c.textPlaceholder}>— GoxUI 0.2.0 · Powered by Gox —</text>
          </column>
        </column>

        {/* 全局弹层宿主 (消息/加载) — 挂在内容外层 */}
        <GxMessageHost />
        <GxLoadingHost />

        {/* 对话框 */}
        <GxDialog
          title="确认操作"
          subtitle="这一版的对话框终于有正常的布局了"
          open={() => dialogOpen()}
          onClose={() => setDialogOpen(false)}
          footer={() => (
            <row gap={space.md}>
              <GxButton onClick={() => setDialogOpen(false)}>取消</GxButton>
              <GxButton type="primary" onClick={() => { setDialogOpen(false); GxMessage.success("已确认"); }}>确定</GxButton>
            </row>
          )}
        >
          <text font={13} color={c.textRegular}>这是一个 Element Plus 风格的对话框。</text>
          <text font={12} color={c.textSecondary}>点遮罩 / Esc / 右上角叉 都可关闭。</text>
        </GxDialog>
      </column>
    </scroll>
  </window>
);
