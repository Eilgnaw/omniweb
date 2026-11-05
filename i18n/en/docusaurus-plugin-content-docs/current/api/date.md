---
sidebar_position: 10
---

# Date and time

Use the standard JavaScript `Date` for ordinary date calculations. Use `Intl.DateTimeFormat` for time zones and formatting. For a clock or countdown that keeps moving, use the [Date component](../components/date.md).

## Read the current time

```js
const now = new Date()
this.year = now.getFullYear()
this.month = now.getMonth() + 1 // months are zero-based
this.day = now.getDate()
this.hour = now.getHours()
this.minute = now.getMinutes()
```

:::warning `new Date()` isn't a live clock
It only represents the time when this JavaScript run started. The widget won't keep running JS as seconds or minutes change.
:::

## Format in a time zone

```js
const formatter = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Shanghai"
})

this.time = formatter.format(new Date())
```

## Build a time string yourself

```js
const now = new Date()
const pad = (value) => String(value).padStart(2, "0")
this.time = `${pad(now.getHours())}:${pad(now.getMinutes())}`
```

## Lunar date

```js
this.lunar = Calendar.lunarDate()
```

See [Calendar](./calendar.md) for more lunar and date-difference functions.

## When the display must keep updating

- Current clock: Date component with the `time` style.
- Countdown or count-up: Date component with the `timer` style.
- Ongoing status: Live Activity.

## Quick reference

```js
new Date()                         // current run time
Date.now() → number               // millisecond timestamp
new Intl.DateTimeFormat(...)      // format for a locale and time zone
Calendar.lunarDate() → string     // current lunar date
```
