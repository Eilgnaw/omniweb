---
sidebar_position: 10
---

# 日期与时间

普通日期计算使用标准 JavaScript `Date`。需要时区格式化时使用 `Intl.DateTimeFormat`；需要持续走动的时钟或倒计时时，使用 [Date 组件](../components/date.md)。

## 读取当前时间

```js
const now = new Date()
this.year = now.getFullYear()
this.month = now.getMonth() + 1 // 月份从 0 开始
this.day = now.getDate()
this.hour = now.getHours()
this.minute = now.getMinutes()
```

:::warning `new Date()` 不是实时钟表
它只表示这一次 JavaScript 运行时的时间。小组件不会为了秒针或分钟变化持续运行 JS。
:::

## 按时区格式化

```js
const formatter = new Intl.DateTimeFormat("zh-CN", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Shanghai"
})

this.time = formatter.format(new Date())
```

## 自己拼接时间

```js
const now = new Date()
const pad = (value) => String(value).padStart(2, "0")
this.time = `${pad(now.getHours())}:${pad(now.getMinutes())}`
```

## 农历

```js
this.lunar = Calendar.lunarDate()
```

更多农历和日期差计算见[日历](./calendar.md)。

## 需要持续更新时

- 当前时钟：Date 组件的 `time` 样式。
- 倒计时或正计时：Date 组件的 `timer` 样式。
- 持续状态：实时活动。

## 速查

```js
new Date()                         // 当前运行时刻
Date.now() → number               // 毫秒时间戳
new Intl.DateTimeFormat(...)      // 按语言和时区格式化
Calendar.lunarDate() → string     // 当前农历日期
```
