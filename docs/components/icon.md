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
| 不透明度 | `0` 到 `1` |
| 旋转 / 偏移 | 调整角度和位置 |

## 示例：显示天气图标

```js
const result = await Weather.getCurrent()
const weather = JSON.parse(result)
this.icon = weather.symbolName
```

把 Icon 的内容设为 `${icon}`。WeatherKit 返回的 `symbolName` 可以直接使用。

:::tip 锁屏组件
锁屏圆形、矩形和内联组件通常以单色显示。优先使用轮廓清楚的 SF Symbol，避免依赖多种颜色表达含义。
:::
