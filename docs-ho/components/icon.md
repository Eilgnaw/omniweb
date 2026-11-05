---
sidebar_position: 3
---

# 图标

图标可以显示内置系统符号或 Emoji，也可以根据数据动态切换。

## 最快用法

添加**图标**，在“图标”中选择内置符号，或直接输入名称：

| 填写 | 结果 |
| --- | --- |
| `star` | 星形符号 |
| `heart` | 心形符号 |
| `🌞` | Emoji |
| `${icon}` | JavaScript 动态决定 |

## 属性

| 字段 | 常用填写 | 作用 |
| --- | --- | --- |
| 图标 | `star` / `heart` / `🌞` / `${icon}` | 符号名称、Emoji 或变量 |
| 字号 | `24` / `24vp` / `${size}` | 图标大小 |
| 字重 | `normal` / `bold` / `medium` | 内置符号粗细 |
| 前景色 | `#000000` / `${color}` | 内置符号颜色 |
| 宽 / 高、偏移、内外边距 | 数字、百分比或变量 | 通用布局字段 |
| 显示、背景色、圆角、旋转、不透明度 | 固定值或变量 | 通用视觉字段 |

## 示例：按状态切换

```js
const data = await new Request("https://api.example.com/status").fetchJSON()

let icon = data.ok ? "checkmark" : "exclamationmark"
let color = data.ok ? "#34C759" : "#FF3B30"
```

把“图标”设为 `${icon}`，“前景色”设为 `${color}`。

:::warning Emoji 不响应前景色
Emoji 的颜色由系统字体决定。只有内置符号可以通过“前景色”换色。
:::

如果符号名称显示为空白，请在编辑器的图标选择器中重新选择，或用 Emoji / `?` 作为回退。
