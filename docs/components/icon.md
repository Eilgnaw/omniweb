---
sidebar_position: 3
---

# 图标 Icon

用 Icon 显示 Apple 的 SF Symbols。图标不需要联网，可以无损缩放，并会自然融入系统界面。

## 最快用法

1. 添加 **icon**。
2. 在属性面板中选择一个 SF Symbol，或在“内容”里输入名称。

| 内容 | 结果 |
| --- | --- |
| `sun.max` | 太阳图标 |
| `cloud.rain` | 雨云图标 |
| `heart.fill` | 实心爱心 |
| `${icon}` | 由 JavaScript 决定 |

不必记住图标名称，编辑器内置了选择器。也可以在 [Apple SF Symbols](https://developer.apple.com/sf-symbols/) 中查找名称。

## 常用属性

| 属性 | 作用 |
| --- | --- |
| 内容 | SF Symbol 名称，例如 `bolt.fill` |
| 宽 / 高 | 图标尺寸 |
| 颜色 | 单色或渐变 |
| 粗细 | 从 `ultraLight` 到 `black` 的系统图标字重，支持占位符 |
| 渲染模式 | 单色、分层、调色板或 SF Symbols 自带多色 |
| 调色板颜色 | 调色板模式使用前景色、辅助色和第三色 |
| 不透明度 | `0` 到 `1` |
| 旋转 / 偏移 | 调整角度和位置 |
| Blend Mode | 与下方内容混合；详见[视觉效果](./visual-effects.md#blend-mode) |

## 图标粗细

粗细使用 SF Symbols 的系统字重。支持值按从细到粗排列：

```text
ultraLight / thin / light / regular / medium
semibold / bold / heavy / black
```

默认值是 `regular`。粗细支持占位符，例如：

```js
this.symbolWeight = "bold"
```

把粗细设为 `${symbolWeight}`。不支持的值会回退到 `regular`。

## 系统图标的多色模式

Icon 支持四种 SF Symbols 渲染模式：

| 模式 | 颜色来源 |
| --- | --- |
| `monochrome` | 使用前景色或渐变 |
| `hierarchical` | 从前景色生成不同强调层级 |
| `palette` | 使用前景色、辅助色和第三色，图标实际使用几层由 SF Symbol 决定 |
| `multicolor` | 使用 SF Symbol 自带的系统颜色 |

渲染模式和调色板颜色都支持占位符。例如：

```js
this.symbolMode = "palette"
this.secondaryColor = "FF9500"
this.tertiaryColor = "34C759"
```

把渲染模式设为 `${symbolMode}`，再在辅助色和第三色的手动输入中分别使用 `${secondaryColor}` 和 `${tertiaryColor}`。

不是所有 SF Symbol 都有多个颜色层。使用 `multicolor` 后仍显示单色，通常表示该图标没有内置多色版本；需要自定义颜色时改用 `palette`。

## 示例：显示天气图标

```js
const weather = await Weather.current()
this.icon = weather.symbolName
```

把 Icon 的内容设为 `${icon}`。WeatherKit 返回的 `symbolName` 可以直接使用。

:::tip 锁屏组件
锁屏圆形、矩形和内联组件通常以单色显示。优先使用轮廓清楚的 SF Symbol，避免依赖多种颜色表达含义。
:::
