---
sidebar_position: 7.5
---

# 画布

画布按一组绘制指令生成图形。适合做进度环、折线图、柱状图、徽章、仪表盘和带描边的文字。它不执行任意代码,同一组指令可以同时用于编辑器预览和桌面卡片。

## 用法

在编辑器底部点加号,添加 **画布**。新画布会显示一个 `75%` 的渐变进度环,可以直接打开「绘制指令」修改。

如果图形来自 JS,推荐让 JS 生成数组,再在「绘制指令」中填 `${drawing}`。也可以点“插入变量”直接选择数组,编辑器会填写完整数组绑定,不会把它转换成循环数据源:

```js
let drawing = [
  {
    op: "circle",
    x: 50,
    y: 50,
    radius: 40,
    fill: "#0A59F7",
  },
  {
    op: "text",
    text: "75%",
    x: 50,
    y: 50,
    size: 18,
    fill: "#FFFFFF",
    align: "center",
    baseline: "middle",
  },
]
```

对应设置:

| 字段 | 填写 |
|---|---|
| 绘制指令 | `${drawing}` |
| 坐标宽度 | `100` |
| 坐标高度 | `100` |
| 缩放模式 | `fit` |
| 宽 / 高 | `120` |

「坐标宽度」和「坐标高度」定义指令使用的坐标范围,「宽」和「高」定义画布实际显示尺寸。

## 属性

| 字段 | 可填写 | 说明 |
|------|------|------|
| 绘制指令 | `${drawing}` / JSON 数组 | 按数组顺序从前往后绘制 |
| 坐标宽度 | `100` / `${viewWidth}` | 指令使用的横向坐标范围 |
| 坐标高度 | `100` / `${viewHeight}` | 指令使用的纵向坐标范围 |
| 缩放模式 | `fit` / `stretch` | `fit` 等比居中,`stretch` 横纵方向分别铺满 |
| 宽 / 高 | `120` / `${size}` | 画布实际显示尺寸;建议明确填写 |
| 水平偏移 / 垂直偏移 / Z 轴偏移 | `0` / `8` / `${x}` | 只移动显示位置,不改变原本占位 |
| 内边距 / 外边距 | `8` / `8,8,8,8` | 四周留白 |
| 显示 | `true` / `false` / `${show}` | 控制是否显示 |
| 背景色 | `#FFFFFF` / `${color}` | 画布组件的背景 |
| 圆角 | `0` / `8` / `50%` | 背景圆角 |
| 旋转角度 | `0` / `15` / `${angle}` | 顺时针旋转整个画布 |
| 不透明度 | `0` 到 `1` | `1` 为完全不透明 |

## 绘制指令

每条指令都需要 `op`。常用指令:

| `op` | 主要填写 | 用途 |
|---|---|---|
| `rect` / `roundRect` | `x`, `y`, `width`, `height`, `radius` | 矩形或圆角矩形 |
| `circle` | `x`, `y`, `radius` | 圆形 |
| `arc` | `x`, `y`, `radius`, `start`, `end` | 圆弧;角度单位为度 |
| `line` | `x1`, `y1`, `x2`, `y2` | 直线 |
| `polyline` | `points`, `close` | 折线或多边形 |
| `path` | `segments` | 组合路径 |
| `text` | `text`, `x`, `y`, `size` | 文字 |
| `clear` | `x`, `y`, `width`, `height` | 清除指定区域 |
| `save` / `restore` | 无 | 保存或恢复当前绘制状态 |
| `translate` | `x`, `y` | 平移后续指令 |
| `rotate` | `angle`, `x`, `y` | 围绕指定点旋转后续指令 |
| `scale` | `scaleX`, `scaleY`, `x`, `y` | 围绕指定点缩放后续指令 |
| `clipRect` | `x`, `y`, `width`, `height`, `radius` | 用矩形裁剪后续内容 |
| `clipCircle` | `x`, `y`, `radius` | 用圆形裁剪后续内容 |

`polyline` 的点可以写成 `[x, y]`,也可以写成 `{ x, y }`:

```js
let drawing = [
  {
    op: "polyline",
    points: [[8, 72], [28, 42], [52, 58], [76, 20], [96, 36]],
    stroke: "#0A59F7",
    lineWidth: 4,
    lineCap: "round",
    lineJoin: "round",
  },
]
```

`path` 的 `segments` 支持 `move`、`line`、`quadratic`、`bezier`、`arc` 和 `close`:

```js
let drawing = [
  {
    op: "path",
    segments: [
      { op: "move", x: 10, y: 70 },
      { op: "quadratic", cx: 50, cy: 5, x: 90, y: 70 },
      { op: "line", x: 10, y: 70 },
      { op: "close" },
    ],
    fill: "#0A59F7",
  },
]
```

## 填充、描边与阴影

图形指令可以填写这些通用样式:

| 填写 | 示例 | 说明 |
|---|---|---|
| `fill` | `"#0A59F7"` | 填充颜色;填 `"none"` 可关闭 |
| `stroke` | `"#FFFFFF"` | 描边颜色;填 `"none"` 可关闭 |
| `lineWidth` | `4` | 描边宽度 |
| `lineCap` | `"butt"` / `"round"` / `"square"` | 线段端点 |
| `lineJoin` | `"miter"` / `"round"` / `"bevel"` | 线段连接 |
| `dash` | `[6, 4]` | 虚线长度数组 |
| `dashOffset` | `2` | 虚线起始偏移 |
| `alpha` | `0.6` | 当前指令的不透明度 |
| `shadowColor` | `"#55000000"` | 阴影颜色 |
| `shadowBlur` | `8` | 阴影模糊 |
| `shadowX` / `shadowY` | `0` / `4` | 阴影偏移 |
| `composite` | `"source-over"` | 图形混合方式 |

同一个图形可以同时填写 `fill` 和 `stroke`。文字也支持 `stroke` 和 `lineWidth`,因此可以直接做文字描边,不需要复制八份文字来模拟。

文字还支持:

- `weight`:例如 `"normal"`、`"bold"`、`"700"`。
- `fontStyle`:`"normal"`、`"italic"`、`"oblique"`。
- `fontFamily`:字体名称。
- `align`:`"left"`、`"center"`、`"right"`、`"start"`、`"end"`。
- `baseline`:`"top"`、`"middle"`、`"bottom"`、`"alphabetic"` 等。
- `maxWidth`:文字最大宽度。

## 渐变与深浅色

`fill` 和 `stroke` 可以使用线性或径向渐变:

```js
let gradient = {
  type: "linear",
  x0: 0,
  y0: 0,
  x1: 100,
  y1: 100,
  stops: [
    { offset: 0, color: "#53C8FF" },
    { offset: 1, color: "#0A59F7" },
  ],
}

let drawing = [
  { op: "circle", x: 50, y: 50, radius: 38, fill: gradient },
]
```

径向渐变把 `type` 改为 `"radial"`,并填写 `x0`、`y0`、`r0`、`x1`、`y1`、`r1`。

颜色也可以分别适配浅色和深色模式:

```js
let drawing = [
  {
    op: "text",
    text: "自动配色",
    x: 50,
    y: 50,
    size: 16,
    fill: {
      light: "#162033",
      dark: "#F7FAFF",
    },
    align: "center",
    baseline: "middle",
  },
]
```

## 注意事项

:::tip 画布适合数据图形
固定的文字、图片和图标仍建议使用对应组件。画布更适合一组数据共同决定的图表、路径和特殊文字效果。
:::

:::tip 裁剪前先保存状态
裁剪会影响后续指令。需要恢复时,在 `clipRect` 或 `clipCircle` 前放一条 `save`,结束后放一条 `restore`。
:::

:::warning 当前不是连续动画画布
画布会在绘制指令、尺寸或深浅色模式变化时重新绘制,不持续执行动画。桌面卡片的刷新频率仍受系统限制。
:::

:::warning 指令数量有限制
一次最多处理 100 条绘制指令。折线点或组合路径片段最多处理 200 个,每个渐变最多处理 16 个色标。超过部分会被忽略。
:::

:::warning 无效指令会被跳过
「绘制指令」最终不是数组、JSON 格式错误或单条指令参数无效时,对应内容不会显示。当前版本不支持在绘制指令中直接画图片。
:::
