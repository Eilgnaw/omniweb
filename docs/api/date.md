---
sidebar_position: 10
---

# 日期 / 时间

JS 里取当前时间用标准 `Date` 对象就行,这里只列**特殊场景**。

## 当前时间

```js
const now = new Date()
this.year    = now.getFullYear()    // 2026
this.month   = now.getMonth() + 1   // 5  注意:月份从 0 开始
this.day     = now.getDate()        // 23
this.hours   = now.getHours()       // 14
this.minutes = now.getMinutes()     // 30
this.seconds = now.getSeconds()     // 5
```

:::warning 不要拿来当时钟
小组件**最快 15 分钟刷一次**(且系统说了算),`new Date()` 取到的"秒"几乎肯定是错的。
要"实时秒针"显示,使用 [date 组件](../components/date.md) 的 `time` / `timer` 样式。
:::

## 农历

```js
this.lunar = Calendar.lunarDate()
console.log(this.lunar)
// 2026丙午年三月十六
```

详见 [日历 API](./calendar.md)。

## 时区与格式化

JS 标准库 `Intl.DateTimeFormat` 全部可用:

```js
const fmt = new Intl.DateTimeFormat("zh-CN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Shanghai",
})
this.now = fmt.format(new Date())  // "14:30"
```

或简单的:

```js
const pad = (n) => String(n).padStart(2, "0")
this.now = `${pad(d.getHours())}:${pad(d.getMinutes())}`
```

## 倒计时(系统级)

让组件**自己跑秒**,不需要 JS 介入。配置 [date 组件](../components/date.md) 即可。
