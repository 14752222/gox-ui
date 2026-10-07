<div align="center">

# GoxUI

**Element Plus 风格的 Gox 桌面 GUI 组件库**

基于 [Gox](https://github.com/14752222/Gox)（Go 实现的 ES6 运行时 + gfx 渲染内核）的纯 ESM 函数组件库。
一套代码，桌面（Windows / macOS / Linux）与移动（Android / iOS / 鸿蒙）同构运行。

![showcase](docs/showcase-light.png)

**移动端形态**（同一套代码，触控档自动切换）：

![showcase-mobile](docs/showcase-mobile.png)

</div>

---

## 为什么需要 GoxUI

Gox 内核提供了 40+ 内置元素（`button` / `input` / `table` / `dialog` ...）与响应式信号（`gx/solid`），
但它们是"材质"——原生外观、原子能力。GoxUI 在其之上做"设计系统"：

- **Element Plus 语义**：`type="primary|success|warning|danger|info"`、`size="large|default|small"`、
  `plain` / `round` / `text` / `loading`，从 Vue 生态迁移零学习成本
- **Element Plus 配色**：品牌蓝 `#409EFF` 与全套功能色、中性色阶，亮暗双主题自动切换
- **设计令牌驱动**：间距 / 圆角 / 字号 / 控件尺寸 / 阴影全部走统一梯度表，换皮只改一处
- **跨端自适应**：桌面 / 移动（Android · iOS · 鸿蒙）同一份代码，触控与鼠标档自动切换
- **复合组件**：Form / Steps / Timeline / Descriptions / Collapse / Breadcrumb / Result / Message
  这些"多原子组合"的组件，内核不提供，GoxUI 补齐

## 多端适配

GoxUI 不是 Web 库——它跑在 Gox 的原生渲染内核上，桌面（Windows / macOS / Linux）与
移动（Android / iOS / 鸿蒙）同一份代码。端差异收敛在 `src/adaptive.js` 一层：

| 差异点 | 桌面（鼠标档） | 移动（触控档） |
|---|---|---|
| 控件高度 | 40 / 32 / 24 | 52 / **44** / 44（命中区下限 44，WCAG 2.5.5） |
| 字号 | 11–26 梯度 | 触控档整体 +1~2 |
| Dialog | 居中卡片 + 遮罩 | **底部动作面板**（BottomSheet：贴底、顶圆角、拖拽指示条、按钮纵向满宽） |
| Steps | 横向 | compact 断点（<600dp）自动转**纵向** |
| CheckboxGroup | 横向换行 | **纵向整行**（拇指扫列更好按） |
| Tooltip | hover 提示 | 触屏不渲染（信息走 label/描述） |
| 输入框 | 定宽 240 | compact 断点强制满宽 |
| 点击反馈 | 视觉态 | 视觉态 + **轻震动**（`vibrate`，内核软降级） |

判定来源：`gx/device`（platform / isMobile / isTablet）+ `gx/viewport`（widthClass
三档断点 / safeArea / keyboardVisible）。断点与安全区跟随内核口径（compact <600dp ·
medium 600–840 · expanded >840），窗口 resize / 折叠屏展开时自动重算。

```js
// 应用层可直接用
import { adaptive, safeArea, isCompact } from "gox-ui";

const a = adaptive();   // { touch, compact, medium, expanded, platform, ... }

// 安全区: 刘海/手势条/键盘
<column {...safeArea(true)}>...</column>

// 强制指定档位 (带触屏的桌面设备 / 模拟器调试)
import { setPointerOverride } from "gox-ui";
setPointerOverride(true);   // 切到触控档
```

桌面开发期可跑移动端模拟：`gox demo/showcase-mobile.js`（400×720 小窗 + 触控档强制开启）。

## 设计规范

GoxUI 的视觉语言收敛为三张梯度表 + 一组语义映射，全部定义在 `src/theme.js`：

| 梯度 | 值 |
|---|---|
| **间距** `space` | 2 / 4 / 6 / 8 / 12 / 16 / 20 / 24 / 32 / 40（4px 基准） |
| **圆角** `radius` | sm 3 · base 6 · md 8 · lg 10 · xl 12 · 2xl 16 · pill 999 |
| **字号** `fontSize` | xs 11 · sm 12 · base 13 · md 14 · lg 16 · xl 18 · title 20 · hero 26 |
| **控件** `control` | large 40px · default 32px · small 24px（高度 / 字号 / 横向留白成套） |
| **阴影** `shadow()` | xs → xl 五档 (alpha 0.04 → 0.14) |

语义色经 `toneOf(c, type)` 解析——`danger` 在 Button / Tag / Alert / Message / Result /
Progress / Timeline 里是同一个红，亮暗两套色板（`palettes.light` / `palettes.dark`）自动跟随内核主题。

## 安装

```bash
gox add gox-ui
```

或直接引用源码（无构建步骤，纯 ESM）：

```js
import { GxButton } from "gox-ui";               // 聚合入口
import { GxButton } from "gox-ui/src/components/button.js";  // 细分模块
```

## 快速上手

```jsx
import { h, render } from "gx/gfx";
import { createSignal } from "gx/solid";
import { GxButton, GxInput, GxCard, GxMessage, GxMessageHost } from "gox-ui";

const [name, setName] = createSignal("");

render(
  <window title="Hello GoxUI" width={420} height={280}>
    <column gap={16} padding={24} font={14}>
      <GxCard header="问候">
        <row gap={10} alignItems="center">
          <GxInput placeholder="你的名字" model={name} clearable />
          <GxButton type="primary" onClick={() => GxMessage.success(`你好, ${name()}!`)}>
            打招呼
          </GxButton>
        </row>
      </GxCard>
      <GxMessageHost />
    </column>
  </window>
);
```

> **提示**：建议在根容器写 `font={14}`。Gox 内核按显示器缩放推导缺省字号时
> 会查询显示器表，窗口内有大量文本且**未显式指定 font** 时会频繁触发枚举
> （详见 [已知问题](#已知问题)）——显式 font 既规避该问题，也让字号语义明确。

## 组件清单（34）

| 分类 | 组件 |
|---|---|
| **基础** | `GxButton` `GxButtonGroup` `GxInput` `GxSwitch` `GxCheckbox` `GxRadio` `GxCheckboxGroup` `GxSelect` `GxSlider` `GxRate` `GxDatePicker` `GxUpload` `GxIcon` |
| **布局** | `GxSpace` `GxDivider` `GxCard` `GxCollapse` |
| **导航** | `GxBreadcrumb` `GxSteps` `GxTabs` / `GxTabPane` `GxPagination` |
| **数据展示** | `GxTable` `GxTag` `GxAvatar` `GxDescriptions` `GxTimeline` `GxResult` `GxEmpty` `GxSkeleton` |
| **反馈** | `GxDialog` `GxAlert` `GxMessage` / `GxMessageHost` `GxProgress` `GxTooltip` `GxLoadingHost` / `useLoading` |
| **表单** | `GxForm` / `GxFormItem` |
| **样式层** | `panel()` `box()` `pad()` `txt()` `hline()` `vline()` |
| **主题** | `palette()` `toneOf()` `space` `radius` `fontSize` `control` `shadow()` |

### 受控与 model 指令

所有表单类组件同时支持**受控 props**（`value` / `checked` + `onInput` / `onChange`）
与 Gox 的 **`model` 指令**（一条指令接好读写）：

```jsx
const [city, setCity] = createSignal("");

// model 写法
<GxSelect model={city} options={["北京", "上海"]} />

// 等价的受控写法
<GxSelect value={() => city()} onChange={(e) => setCity(e.value)} options={["北京", "上海"]} />
```

### 命令式消息

```jsx
import { GxMessage, GxMessageHost } from "gox-ui";

// 在应用根部挂宿主（一次）
<column font={14}>
  {/* ...你的界面... */}
  <GxMessageHost />
</column>

// 任意位置调用
GxMessage.success("保存成功");
GxMessage.error("网络错误");
const close = GxMessage("自定义", { type: "warning", duration: 5000 });
close(); // 提前关闭
```

### 主题与暗色模式

GoxUI 的调色板跟随内核主题（`gx/theme`）自动切换（读 `current().text` 的亮度判定，
对 `setTheme({...})` 自定义主题也有效），无额外 API：

```js
import { setTheme } from "gx/theme";
setTheme("dark");   // 下一帧整套换肤
```

组件不硬编码颜色，全部引用 `palette()`；也可以强制指定模式或覆盖 token：

```js
import { setMode, palette } from "gox-ui";
setMode("dark");            // 只影响 GoxUI 取色, 不动内核
setTheme({ accent: "#e67e22" });  // 内核层强调色
```

## 与 Element Plus 的对照

| Element Plus | GoxUI | 差异 |
|---|---|---|
| `<el-button type="primary">` | `<GxButton type="primary">` | 同款语义 |
| `v-model="x"` | `model={x}` | Gox 原生指令 |
| `ElMessage.success()` | `GxMessage.success()` | 需挂 `<GxMessageHost/>` |
| `el-scope` CSS 变量 | `palette()` token 表 | JS 对象而非 CSS |
| 暗色 `html.dark` | `setTheme("dark")` | 内核级，下一帧生效 |

## 开发

```bash
git clone https://github.com/14752222/gox-ui
cd gox-ui
gox demo/showcase.js            # 桌面全家福
gox demo/showcase-mobile.js     # 移动端形态模拟 (400×720 + 触控档)
gox test/smoke.js               # 78 项冒烟测试 (含多端用例)
python test/shot_verify.py docs/showcase-light.png       # 桌面截图 + 六项断言
python test/shot_mobile_verify.py                        # 移动模拟截图 + 四项断言
```

项目结构：

```
src/
  index.js            # 聚合入口
  theme.js            # 设计令牌 (色板/间距/圆角/字号/控件/阴影, 亮暗判定)
  adaptive.js         # 多端自适应 (设备形态/断点/触控尺寸表/交互开关)
  styles.js           # 样式构造层 (panel/box/pad/txt/hline — 统一的容器出口)
  utils.js            # mergeProps / flattenChildren / resolveVal / pickValue
  components/
    button.js  input.js  card.js  ...   # 每组件一文件
demo/
  showcase.js         # 桌面全组件演示
  showcase-mobile.js  # 移动端形态模拟
test/
  smoke.js            # 组件树构造冒烟 (gox test/smoke.js)
  shot_verify.py      # 桌面截图 + 像素/几何断言
  shot_mobile_verify.py  # 移动模拟截图断言
docs/
  showcase-light.png  # 桌面截图
  showcase-mobile.png # 移动端形态截图
```

## 已知问题

1. **Gox 内核 `defaultFontSize()` 在 Windows 上会频繁枚举显示器**，窗口内存在大量
   未显式指定 `font` 的文本时，`syscall.NewCallback` 累积可能触及 Windows 回调上限
   导致崩溃（`fatal error: too many callback functions`）。**规避**：根容器写
   `font={14}`，GoxUI 的 demo 与文档均按此约定。这是内核问题，已在 Gox 仓库跟踪。
2. **Gox 内核：模块内非导出的 `function` 声明无法访问 import 绑定**
   （`ReferenceError: xxx is not defined`；箭头函数与导出函数正常）。
   GoxUI 全库使用 `const` 箭头函数规避，同样已在 Gox 仓库跟踪。
3. **Gox 内核：`export function` 不参与函数提升**（编译器的 hoist 循环只匹配裸
   `FunctionDeclaration`，被 `ExportDeclaration` 包裹的函数不提升）。因此
   "先声明的导出函数调用后声明的函数"会 ReferenceError。**规避**：库内代码
   遵守"被调用者先声明"（`styles.js` 有详细注释）。
4. **gfx 布局容器语义**：`rect` 不是布局容器——`layoutNode` 的 default 分支把
   所有子节点摆在内容区左上角（高度 0、兄弟叠压）。所有"容器"必须用
   `column` / `row` / `grid`。GoxUI 的 `panel()` / `box()` 从 API 层封死了这个坑。

## License

MIT
