---
sidebar_position: 6
---

# 日期 Date

Date 显示日期、时间、相对时间或倒计时。它使用 iOS 的系统时间文本，可以持续更新，而不需要频繁运行 JavaScript。

## 最快用法

1. 添加 **date**。
2. 在“内容”里填写时间来源。
3. 选择显示样式。

### 内容

| 内容 | 含义 |
| --- | --- |
| `now` | 当前时间 |
| `tomorrow` | 明天的同一时刻 |
| `yesterday` | 昨天的同一时刻 |
| `startoftoday` | 今天 00:00 |
| `2030-01-01 00:00:00` | 指定时刻，格式必须一致 |
| `${target}` | 由 JavaScript 提供时间字符串 |

### 样式

| 样式 | 显示内容 |
| --- | --- |
| `time` | 当前时钟，例如 `14:30` |
| `date` | 日期 |
| `relative` | 相对时间，例如“5 分钟前” |
| `offset` | 时间差，例如 `+05:00` |
| `timer` | 倒计时或正计时，例如 `00:05:00` |

## 示例：倒计时到指定时间

```js
this.target = "2030-01-01 00:00:00"
```

Date 设置：

- 内容：`${target}`
- 样式：`timer`

## 示例：倒计时到明天零点

```js
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(0, 0, 0, 0)

const pad = (value) => String(value).padStart(2, "0")
this.target = [
  tomorrow.getFullYear(),
  "-", pad(tomorrow.getMonth() + 1),
  "-", pad(tomorrow.getDate()),
  " ", pad(tomorrow.getHours()),
  ":", pad(tomorrow.getMinutes()),
  ":", pad(tomorrow.getSeconds())
].join("")
```

把内容设为 `${target}`，样式设为 `timer`。

:::tip 为什么它能持续更新？
普通小组件不能每秒运行 JS，但 Date 由 iOS 自己更新时间文本。其他持续变化的内容请使用[实时活动](../api/control.md)。
:::

## 裁剪

Date 支持从上、下、左、右裁剪，可用于隐藏计时文本的一部分。普通用法可以忽略这些选项。
