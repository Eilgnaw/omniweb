---
sidebar_position: 7.5
---

# 画布

画布按 JSON 指令绘制图形，适合进度环、折线图、柱状图、徽章、仪表盘和描边文字。

## 什么时候使用画布？

| 需求 | 建议 |
| --- | --- |
| 普通文字、图片、图标 | 使用对应组件 |
| 简单系统样式进度 | 使用仪表 |
| 多个数据共同决定一张图、路径或特殊文字效果 | 使用画布 |

## 最快用法

添加**画布**。新画布会显示一个 `75%` 渐变进度环。打开“绘制指令”可以直接编辑 JSON。

```js
let drawing = [
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

把“绘制指令”设为 `${drawing}`。

## 画布属性

| 字段 | 常用填写 | 作用 |
| --- | --- | --- |
| 绘制指令 | `${drawing}` / JSON 数组 | 按数组顺序绘制 |
| 坐标宽度 / 高度 | `100` | 指令使用的虚拟坐标范围 |
| 缩放模式 | `fit` / `stretch` | 等比居中或分别铺满 |
| 宽 / 高 | `120` / `${size}` | 画布实际尺寸 |
| 偏移、内外边距 | 数字或变量 | 通用布局字段 |
| 显示、背景色、圆角、旋转、不透明度 | 固定值或变量 | 通用视觉字段 |

## 绘制指令

| `op` | 主要字段 | 用途 |
| --- | --- | --- |
| `rect` / `roundRect` | `x`、`y`、`width`、`height`、`radius` | 矩形 |
| `circle` | `x`、`y`、`radius` | 圆形 |
| `arc` | `x`、`y`、`radius`、`start`、`end` | 圆弧，角度单位为度 |
| `line` | `x1`、`y1`、`x2`、`y2` | 直线 |
| `polyline` | `points`、`close` | 折线或多边形 |
| `path` | `segments` | 组合路径 |
| `text` | `text`、`x`、`y`、`size` | 文字 |
| `clear` | `x`、`y`、`width`、`height` | 清除区域 |
| `save` / `restore` | 无 | 保存或恢复绘制状态 |
| `translate` / `rotate` / `scale` | 坐标、角度或比例 | 变换后续指令 |
| `clipRect` / `clipCircle` | 位置和尺寸 | 裁剪后续内容 |

`path.segments` 支持 `move`、`line`、`quadratic`、`bezier`、`arc` 和 `close`。

## 填充与描边

| 字段 | 示例 | 作用 |
| --- | --- | --- |
| `fill` / `stroke` | `"#0A59F7"` | 填充和描边；`"none"` 关闭 |
| `lineWidth` | `4` | 线宽 |
| `lineCap` / `lineJoin` | `"round"` | 端点和连接样式 |
| `dash` / `dashOffset` | `[6, 4]` / `2` | 虚线 |
| `alpha` | `0.6` | 当前指令不透明度 |
| `shadowColor` / `shadowBlur` | `"#55000000"` / `8` | 阴影 |
| `shadowX` / `shadowY` | `0` / `4` | 阴影偏移 |
| `composite` | `"source-over"` | 混合方式 |

`fill` 和 `stroke` 支持纯色、线性渐变、径向渐变，以及 `{ light, dark }` 深浅色对象。

## 限制

- 最多 100 条绘制指令。
- 折线点和路径片段最多 200 个。
- 每个渐变最多 16 个色标。
- `save` 深度最多 20 层。
- 无效指令会跳过，超过限制的部分会截断。
- 当前不能在绘制指令中直接画图片，也不是连续动画环境。

:::tip 裁剪前先保存
在 `clipRect` 或 `clipCircle` 前放 `save`，结束后放 `restore`，避免裁剪影响后续指令。
:::
