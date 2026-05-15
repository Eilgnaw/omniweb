---
sidebar_position: 10
---

# Date / Time

For the current time in JS, just use the standard `Date` object. This page only covers the **special cases**.

## Current Time

```js
const now = new Date()
this.year    = now.getFullYear()    // 2026
this.month   = now.getMonth() + 1   // 5  note: months are 0-indexed
this.day     = now.getDate()        // 23
this.hours   = now.getHours()       // 14
this.minutes = now.getMinutes()     // 30
this.seconds = now.getSeconds()     // 5
```

:::warning Don't use this as a clock
Widgets refresh **at most every 15 minutes** (and even that's up to the system), so the "seconds" from `new Date()` will almost certainly be wrong.
For a "real-time second hand" display, use the [date component](../components/date.md)'s `time` / `timer` styles.
:::

## Lunar Date

```js
this.lunar = Calendar.lunarDate()
console.log(this.lunar)
// 2026丙午年三月十六
```

See [Calendar API](./calendar.md) for details.

## Time Zones and Formatting

The full standard `Intl.DateTimeFormat` is available:

```js
const fmt = new Intl.DateTimeFormat("zh-CN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Shanghai",
})
this.now = fmt.format(new Date())  // "14:30"
```

Or a simpler approach:

```js
const pad = (n) => String(n).padStart(2, "0")
this.now = `${pad(d.getHours())}:${pad(d.getMinutes())}`
```

## Countdown (System-Level)

Let the component **tick by itself** — no JS needed. Just configure a [date component](../components/date.md).
