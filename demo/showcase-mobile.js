// 移动端形态模拟演示 —— 用小窗口 (400×720, 模拟手机竖屏) 强制触控档,
// 展示 GoxUI 在移动端的自适应表现:
//   1. 按钮 44+ 命中高、更大字号
//   2. 对话框转底部动作面板 (BottomSheet)
//   3. Steps 纵向排列
//   4. CheckboxGroup 纵向
//   5. Tooltip 触屏不渲染
// 运行: gox demo/showcase-mobile.js
//
// 【为什么能模拟】内核的 widthClass 按窗口宽度算 —— 400px 窗口落在
// compact (<600dp), isCompact() 为真; setPointerOverride(true) 把指针
// 判定切到触控档。两条开关一开, 组件就走移动端分支。

import { h, render } from "gx/gfx";
import { createSignal } from "gx/solid";

import {
  GxButton, GxInput, GxSwitch, GxCheckboxGroup, GxSelect,
  GxCard, GxSteps, GxDialog, GxMessage, GxMessageHost, GxTooltip,
  GxForm, GxFormItem, GxAlert, GxTag, GxProgress, GxRate,
  palette, space,
  setPointerOverride, adaptive,
} from "../src/index.js";

const [sheetOpen, setSheetOpen] = createSignal(false);
const [progress, setProgress] = createSignal(60);
const [step, setStep] = createSignal(1);
const [hobby, setHobby] = createSignal(["code"]);
const [agree, setAgree] = createSignal(true);
const [name, setName] = createSignal("");

const c = palette();

// 模拟触控档 (真机不需要 —— deviceInfo().isMobile 天然为真)
setPointerOverride(true);

render(
  <window title="GoxUI 移动端模拟" width={400} height={720}>
    <scroll>
      <column gap={space.xl} padding={space.xl} font={15} background={c.bgPage} alignItems="stretch">

        {/* 状态头: 显示当前自适应档位 */}
        <column gap={space.xs} background={c.primary} radius={10} padding={space.lg}>
          <text font={16} fontWeight={700} color="#ffffffff">移动端形态模拟</text>
          <text font={12} color="#ffffffcc">
            {() => {
              const a = adaptive();
              return `touch=${a.touch} · ${a.compact ? "compact" : a.medium ? "medium" : "expanded"} · ${a.platform}`;
            }}
          </text>
        </column>

        <GxAlert type="info" title="这是触控档" description="按钮命中区 ≥44、字号升档、对话框转底部面板。" />

        <GxCard header="触控尺寸" subtitle="按钮高度与字号">
          <column gap={space.lg}>
            <row gap={space.md} wrap>
              <GxButton>Default</GxButton>
              <GxButton type="primary">Primary</GxButton>
              <GxButton type="danger">Danger</GxButton>
            </row>
            <row gap={space.md} wrap>
              <GxButton size="small">Small 44</GxButton>
              <GxButton size="large" type="primary">Large 52</GxButton>
            </row>
          </column>
        </GxCard>

        <GxCard header="表单" subtitle="纵向排布 + 满宽输入">
          <column gap={space.lg}>
            <GxInput placeholder="姓名 (满宽)" model={name} clearable />
            <GxSelect placeholder="城市" options={["北京", "上海", "深圳"]} />
            <GxCheckboxGroup options={["编码", "游戏", "旅行"]} value={() => hobby()} onChange={(e) => setHobby(e.value)} />
            <row gap={space.md} alignItems="center">
              <text font={14} color={c.textRegular}>同意条款</text>
              <GxSwitch model={agree} />
            </row>
          </column>
        </GxCard>

        <GxCard header="Steps 纵向" subtitle="compact 断点自动转">
          <GxSteps
            steps={[{ title: "创建" }, { title: "开发", description: "编写组件" }, { title: "发布" }]}
            active={() => step()}
            onChange={(e) => setStep(e.step)}
          />
          <row gap={space.md} marginTop={space.lg}>
            <GxButton size="small" onClick={() => setStep(Math.max(0, step() - 1))}>上一步</GxButton>
            <GxButton size="small" type="primary" onClick={() => setStep(Math.min(2, step() + 1))}>下一步</GxButton>
          </row>
        </GxCard>

        <GxCard header="底部面板" subtitle="Dialog → BottomSheet">
          <column gap={space.lg}>
            <GxButton type="primary" block onClick={() => setSheetOpen(true)}>打开底部面板</GxButton>
            <GxTooltip text="触屏上不会出现">
              <GxButton block>Tooltip 宿主 (触屏隐藏)</GxButton>
            </GxTooltip>
          </column>
        </GxCard>

        <GxCard header="其他" subtitle="进度 / 标签 / 评分">
          <column gap={space.lg}>
            <GxProgress percentage={() => progress()} />
            <row gap={space.md}>
              <GxButton size="small" onClick={() => setProgress(Math.max(0, progress() - 10))}>-10</GxButton>
              <GxButton size="small" type="primary" onClick={() => setProgress(Math.min(100, progress() + 10))}>+10</GxButton>
            </row>
            <row gap={space.sm} wrap>
              <GxTag type="primary">Primary 32</GxTag>
              <GxTag type="success">Success</GxTag>
              <GxTag type="warning" closable onClose={() => GxMessage.warning("关")}>可关</GxTag>
            </row>
            <GxRate model={createSignal(4)[0]} />
          </column>
        </GxCard>

        <column alignItems="center" marginBottom={space.lg}>
          <text font={11} color={c.textPlaceholder}>— GoxUI 移动端模拟 · 400×720 —</text>
        </column>

        <GxMessageHost />

        {/* 底部面板: footer 按钮纵向满宽 (移动端标准) */}
        <GxDialog
          title="确认操作"
          subtitle="底部动作面板形态"
          open={() => sheetOpen()}
          onClose={() => setSheetOpen(false)}
          footer={() => (
            <column gap={space.md} width="100%">
              <GxButton type="primary" block onClick={() => { setSheetOpen(false); GxMessage.success("已确认"); }}>确定</GxButton>
              <GxButton block onClick={() => setSheetOpen(false)}>取消</GxButton>
            </column>
          )}
        >
          <text font={14} color={c.textRegular}>同一份代码, 手机上自动长这样。</text>
          <text font={12} color={c.textSecondary}>点遮罩 / Esc / 按钮都可关闭。</text>
        </GxDialog>
      </column>
    </scroll>
  </window>
);
