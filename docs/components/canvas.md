---
sidebar_position: 7.5
---

# 画布 Canvas

Canvas 按 JSON 指令绘制图形。适合进度环、折线图、柱状图、徽章、仪表盘和文字描边。

## 什么时候使用 Canvas？

| 需求 | 建议 |
| --- | --- |
| 普通文字、图片、图标 | 使用对应的 Text、Image、Icon |
| 系统样式进度环或进度条 | 使用 Gauge |
| 多个数据共同决定一张图、路径或特殊文字效果 | 使用 Canvas |

Canvas 不执行任意绘图代码。编辑器预览、主屏幕小组件和实时活动会使用同一组指令绘制。

## 最快用法

1. 添加 **Canvas**。新 Canvas 会显示一个 `75%` 渐变进度环。
2. 打开“绘制指令”。
3. 编辑 JSON，格式化并检查后返回预览。

每条指令至少包含 `op`：

```json
[
  {
    "op": "circle",
    "x": 50,
    "y": 50,
    "radius": 40,
    "fill": "#0A59F7"
  }
]
```

指令按数组顺序绘制，后面的内容会盖在前面。

## 把变量放进指令

单个字段可以使用占位符：

```json
[
  {
    "op": "text",
    "text": "${title}",
    "x": "${labelX}",
    "y": 20
  }
]
```

把光标放在字段值上，使用“插入变量”可以避免漏写引号。

### 让 JS 生成整组指令

```js
this.drawing = [
  {
    op: "circle",
    x: 50,
    y: 50,
    radius: 40,
    fill: "#0A59F7"
  },
  {
    op: "text",
    text: "75%",
    x: 50,
    y: 50,
    size: 18,
    fill: "#FFFFFF",
    align: "center",
    baseline: "middle"
  }
]
```

在“插入变量”中选择“绑定整个数组”，再选择 `drawing`。结果是 `${drawing}`，不要写成循环数据源 `${drawing[item]}`。

## 坐标与显示尺寸

| 属性 | 示例 | 作用 |
| --- | --- | --- |
| 绘制指令 | `${drawing}` / JSON 数组 | 按顺序执行的指令 |
| 坐标宽度 | `120` | 绘图使用的虚拟横向范围 |
| 坐标高度 | `120` | 绘图使用的虚拟纵向范围 |
| 缩放模式 | `fit` / `stretch` | 如何把虚拟坐标映射到组件尺寸 |
| 宽 / 高 | `120` | Canvas 在布局中的实际尺寸 |

例如，虚拟坐标是 `100 × 100`，组件尺寸是 `200 × 100`：

- `fit`：保持比例，水平居中。
- `stretch`：X 方向拉伸 2 倍，Y 方向不变。

背景、裁剪、阴影、旋转、偏移、不透明度和显示状态作用于整个 Canvas。

## 基础图形

| `op` | 主要字段 | 用途 |
| --- | --- | --- |
| `rect` / `roundRect` | `x`、`y`、`width`、`height`、`radius` | 矩形或圆角矩形 |
| `circle` | `x`、`y`、`radius` | 圆形 |
| `arc` | `x`、`y`、`radius`、`start`、`end`、`counterClockwise`、`close` | 圆弧，角度单位为度 |
| `line` | `x1`、`y1`、`x2`、`y2` | 直线 |
| `polyline` | `points`、`close` | 折线或多边形 |
| `path` | `segments` | 组合路径 |
| `text` | `text`、`x`、`y`、`size` | 文字 |
| `clear` | `x`、`y`、`width`、`height` | 清除区域；省略尺寸时清除整个画布 |

### 折线

`points` 可以使用 `[x, y]` 或 `{x, y}`：

```js
this.drawing = [
  {
    op: "polyline",
    points: [[8, 72], [28, 42], [52, 58], [76, 20], [96, 36]],
    stroke: "#0A59F7",
    lineWidth: 4,
    lineCap: "round",
    lineJoin: "round"
  }
]
```

### 组合路径

`segments` 支持 `move`、`line`、`quadratic`、`bezier`、`arc` 和 `close`：

```js
this.drawing = [
  {
    op: "path",
    segments: [
      { op: "move", x: 10, y: 70 },
      { op: "quadratic", cx: 50, cy: 5, x: 90, y: 70 },
      { op: "line", x: 10, y: 70 },
      { op: "close" }
    ],
    fill: "#0A59F7"
  }
]
```

## 状态、变换与裁剪

| `op` | 字段 | 作用 |
| --- | --- | --- |
| `save` / `restore` | 无 | 保存或恢复当前变换与裁剪 |
| `translate` | `x`、`y` | 平移后续指令 |
| `rotate` | `angle`、`x`、`y` | 围绕指定点旋转后续指令 |
| `scale` | `scaleX`、`scaleY`、`value`、`x`、`y` | 围绕指定点缩放后续指令 |
| `clipRect` | `x`、`y`、`width`、`height`、`radius` | 矩形或圆角矩形裁剪 |
| `clipCircle` | `x`、`y`、`radius` | 圆形裁剪 |

裁剪会持续影响后面的指令。需要局部裁剪时，在开始前放 `save`，结束后放 `restore`。

## 填充、描边与效果

| 字段 | 示例 | 作用 |
| --- | --- | --- |
| `fill` | `"#0A59F7"` | 填充；`"none"` 关闭 |
| `stroke` | `"#FFFFFF"` | 描边；`"none"` 关闭 |
| `lineWidth` | `4` | 描边宽度 |
| `lineCap` | `"butt"` / `"round"` / `"square"` | 线段端点 |
| `lineJoin` | `"miter"` / `"round"` / `"bevel"` | 线段连接 |
| `miterLimit` | `10` | 斜接限制 |
| `dash` | `[6, 4]` | 虚线数组 |
| `dashOffset` | `2` | 虚线起始偏移 |
| `alpha` | `0.6` | 当前指令不透明度 |
| `shadowColor` | `"#00000055"` | 阴影颜色 |
| `shadowBlur` | `8` | 阴影模糊 |
| `shadowX` / `shadowY` | `0` / `4` | 阴影偏移 |
| `composite` | `"source-over"` | 混合模式 |

支持的混合模式：`source-over`、`multiply`、`screen`、`overlay`、`darken`、`lighten`、`destination-out`、`copy`。未知值按 `source-over` 处理。

## 文字

文字可以同时填充和描边。Canvas 会先描边，再填充：

```js
this.drawing = [
  {
    op: "text",
    text: "Omni Widgets",
    x: 60,
    y: 60,
    size: 22,
    weight: "700",
    stroke: "#0A59F7",
    lineWidth: 2,
    fill: "#FFFFFF",
    align: "center",
    baseline: "middle"
  }
]
```

其他文字字段：

- `weight`：`"normal"`、`"bold"`、`"700"` 等。
- `fontStyle`：`"normal"`、`"italic"`、`"oblique"`。
- `fontFamily`：字体名称。
- `align`：`"left"`、`"center"`、`"right"`、`"start"`、`"end"`。
- `baseline`：`"top"`、`"middle"`、`"bottom"`、`"alphabetic"`、`"hanging"`、`"ideographic"`。
- `maxWidth`：最大绘制宽度。

彩色 Emoji 会正常作为填充文字显示，但不会应用普通字形描边。

## 颜色、深浅色与渐变

单色支持 `#RRGGBB` 和 `#RRGGBBAA`。深浅色可以分别指定：

```js
const adaptiveText = {
  light: "#162033",
  dark: "#F7FAFF"
}
```

线性渐变：

```js
const gradient = {
  type: "linear",
  x0: 0,
  y0: 0,
  x1: 100,
  y1: 100,
  stops: [
    { offset: 0, color: "#53C8FF" },
    { offset: 1, color: "#0A59F7" }
  ]
}
```

径向渐变使用 `type: "radial"` 以及 `x0`、`y0`、`r0`、`x1`、`y1`、`r1`。为了在支持的 iOS 版本上保持一致，建议让起点和终点使用同一圆心。

## 限制

| 项目 | 最大值 |
| --- | ---: |
| 单个 Canvas 指令数 | 100 |
| `polyline` 点数 | 200 |
| `path` 片段数 | 200 |
| 单个渐变色标数 | 16 |
| `save` 栈深度 | 20 |
| `dash` 数组项数 | 20 |
| 虚拟坐标宽高 | 4000 |

:::warning Canvas 不是动画循环
它只会在指令、尺寸或深浅色变化时重绘，不提供游戏循环或逐帧回调。小组件刷新仍受 iOS 调度限制。
:::

:::tip 无效内容会安全跳过
未知 `op` 会被忽略，无效字段回退到安全默认值，超过限制的内容会被截断。当前版本不能在 Canvas 指令中绘制图片。
:::
