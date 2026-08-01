---
sidebar_position: 7.5
---

# 画布 Canvas

画布按一组 JSON 绘制指令生成图形,适合做进度环、折线图、柱状图、徽章、仪表盘和文字描边。它不会执行任意绘图代码,同一组指令会用于编辑器预览、桌面小组件和实时活动。

## 用法

从编辑器右上角 ➕ 添加 **画布**。新画布会显示一个 `75%` 的渐变进度环。

打开「绘制指令」可以:

- 直接编辑 JSON 数组。
- 格式化并检查 JSON。
- 把光标放在字段值处,选择「插入变量」。
- 选择「绑定整个数组」,生成 `${drawing}`。
- 恢复默认示例。

单个指令字段也可以绑定变量:

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

在已有字符串内部插入时,编辑器只插入 `${title}`;在字符串外插入时,编辑器会自动补上 JSON 双引号。

如果图形来自 JS,让 JS 生成数组:

```js
this.drawing = [
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

然后在「插入变量」菜单里选择「绑定整个数组」,再选择 `drawing`。这里绑定的是**整个数组**,不是循环数据源,不要写成 `${drawing[item]}`。

## 属性

| 属性 | 示例 | 说明 |
|---|---|---|
| 绘制指令 | `${drawing}` / JSON 数组 | 按数组顺序从前往后绘制 |
| 坐标宽度 | `120` / `${viewWidth}` | 指令使用的横向虚拟坐标范围 |
| 坐标高度 | `120` / `${viewHeight}` | 指令使用的纵向虚拟坐标范围 |
| 缩放模式 | `fit` / `stretch` | `fit` 等比居中;`stretch` 横纵方向分别铺满 |
| 宽 / 高 | `120` | 画布实际显示尺寸 |
| 背景、裁剪、阴影 | 编辑器通用属性 | 作用于整个画布组件 |
| 旋转、偏移、不透明度、显示 | 编辑器通用属性 | 作用于整个画布组件 |

「坐标宽度 / 高度」决定指令的创作坐标,「宽 / 高」决定组件在布局中的实际尺寸。例如坐标为 `100 × 100`、显示尺寸为 `200 × 100` 时:

- `fit`:保持比例并水平居中。
- `stretch`:X 方向拉伸 2 倍,Y 方向不变。

## 基础图形

每条指令至少需要一个 `op`:

| `op` | 主要字段 | 用途 |
|---|---|---|
| `rect` / `roundRect` | `x`, `y`, `width`, `height`, `radius` | 矩形或圆角矩形 |
| `circle` | `x`, `y`, `radius` | 圆形 |
| `arc` | `x`, `y`, `radius`, `start`, `end`, `counterClockwise`, `close` | 圆弧,角度单位为度 |
| `line` | `x1`, `y1`, `x2`, `y2` | 直线 |
| `polyline` | `points`, `close` | 折线或多边形 |
| `path` | `segments` | 组合路径 |
| `text` | `text`, `x`, `y`, `size` | 文字 |
| `clear` | `x`, `y`, `width`, `height` | 清除区域;省略尺寸时清除整个虚拟画布 |

`polyline.points` 可以使用 `[x, y]` 或 `{x, y}`:

```js
this.drawing = [
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

`path.segments` 支持 `move`、`line`、`quadratic`、`bezier`、`arc` 和 `close`:

```js
this.drawing = [
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

## 状态、变换与裁剪

| `op` | 字段 | 用途 |
|---|---|---|
| `save` / `restore` | 无 | 保存或恢复当前变换和裁剪 |
| `translate` | `x`, `y` | 平移后续指令 |
| `rotate` | `angle`, `x`, `y` | 围绕指定点旋转后续指令 |
| `scale` | `scaleX`, `scaleY`, `value`, `x`, `y` | 围绕指定点缩放后续指令 |
| `clipRect` | `x`, `y`, `width`, `height`, `radius` | 矩形或圆角矩形裁剪 |
| `clipCircle` | `x`, `y`, `radius` | 圆形裁剪 |

裁剪会持续影响后续指令。需要恢复时,在裁剪前放 `save`,结束后放 `restore`。

## 填充、描边与效果

| 字段 | 示例 | 说明 |
|---|---|---|
| `fill` | `"#0A59F7"` | 填充;`"none"` 关闭 |
| `stroke` | `"#FFFFFF"` | 描边;`"none"` 关闭 |
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

保证支持的混合模式:`source-over`、`multiply`、`screen`、`overlay`、`darken`、`lighten`、`destination-out`、`copy`。未知值按 `source-over` 处理。

## 文字

文字可以同时设置填充和描边,绘制顺序为先描边、再填充:

```js
this.drawing = [
  {
    op: "text",
    text: "AWidget",
    x: 60,
    y: 60,
    size: 22,
    weight: "700",
    stroke: "#0A59F7",
    lineWidth: 2,
    fill: "#FFFFFF",
    align: "center",
    baseline: "middle",
  },
]
```

文字还支持:

- `weight`:`"normal"`、`"bold"`、`"700"` 等。
- `fontStyle`:`"normal"`、`"italic"`、`"oblique"`。
- `fontFamily`:字体名称。
- `align`:`"left"`、`"center"`、`"right"`、`"start"`、`"end"`。
- `baseline`:`"top"`、`"middle"`、`"bottom"`、`"alphabetic"`、`"hanging"`、`"ideographic"`。
- `maxWidth`:文字最大绘制宽度。

彩色 Emoji 没有普通字形轮廓。它会正常回退为填充文字,但不会应用文字描边。

## 渐变与深浅色

单色支持 `#RRGGBB` 和 `#RRGGBBAA`。也可以分别指定浅色和深色:

```js
const adaptiveText = {
  light: "#162033",
  dark: "#F7FAFF",
}
```

线性渐变:

```js
const gradient = {
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
```

径向渐变使用 `type: "radial"` 和 `x0`、`y0`、`r0`、`x1`、`y1`、`r1`。为了在支持的所有 iOS 版本上保持一致,首版请让起点圆心和终点圆心相同。

## 限制

| 项目 | 最大值 |
|---|---:|
| 单个画布指令数 | 100 |
| `polyline` 点数 | 200 |
| `path` 片段数 | 200 |
| 单个渐变色标数 | 16 |
| `save` 栈深度 | 20 |
| `dash` 数组项数 | 20 |
| 虚拟坐标宽高 | 4000 |

:::tip 画布适合数据图形
固定文字、图片和图标仍建议使用对应组件。画布更适合一组数据共同决定的图表、路径和特殊文字效果。
:::

:::warning 画布不是连续动画环境
它会在指令、尺寸或深浅色模式变化时重新绘制,不会运行游戏循环或逐帧回调。小组件的刷新频率仍受系统限制。
:::

:::warning 无效指令会被跳过
未知 `op` 会被跳过;无效字段会回退到安全默认值,超过限制的部分会被截断。这些输入不会导致 App 或小组件崩溃。当前版本不支持在画布指令中绘制图片。
:::
