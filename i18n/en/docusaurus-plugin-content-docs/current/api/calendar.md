---
sidebar_position: 9
---

# Calendar

Read system calendar events and lunar dates. Requires the "Calendar" permission.

## Lunar Date

```js
this.lunar = Calendar.lunarDate()
console.log(this.lunar)
// 2026丙午年三月十六
```

`lunarDate()` is synchronous — it returns the lunar date string directly (in Chinese format).

If you want a pre-formatted "year-month-day" string:

```js
const s = Calendar.getLunarDate()
console.log(s) // something like "丙午三月十六"
```

## Lunar Components (Month / Day / Leap Month)

If you want to lay things out yourself or use the values in logic, get the lunar date as numbers:

```js
this.y = Calendar.lunarYear()         // position in the 60-year sexagenary cycle (1–60)
this.m = Calendar.lunarMonth()        // 1–12
this.d = Calendar.lunarDay()          // 1–30
this.leap = Calendar.isLunarLeapMonth() // whether the current lunar month is a leap month
```

| Method | Returns | Description |
|------|------|------|
| `lunarYear()` | Int | 1–60, **not the Gregorian year**; for Heavenly Stems and Earthly Branches use [`ganZhi()`](#chinese-zodiac-and-heavenly-stems--earthly-branches) |
| `lunarMonth()` | Int | 1–12 |
| `lunarDay()` | Int | 1–30 |
| `isLunarLeapMonth()` | Bool | Whether this is a leap month (e.g. returns `true` during a leap second month) |

## Chinese Zodiac and Heavenly Stems / Earthly Branches

```js
console.log(Calendar.zodiac()) // "马" (Horse)
console.log(Calendar.ganZhi()) // "丙午"
```

| Method | Returns |
|------|------|
| `zodiac()` | The year's zodiac sign: Rat / Ox / Tiger / Rabbit / Dragon / Snake / Horse / Goat / Monkey / Rooster / Dog / Pig |
| `ganZhi()` | The year's Heavenly Stems and Earthly Branches, e.g. "甲辰", "丙午" |

## Days Until a Date

Most useful for "Chinese New Year countdown" or "X days until my birthday".

```js
// Days until the next "Lunar New Year's Day" (Spring Festival)
this.dDay = Calendar.daysUntilLunar(1, 1)

// Days until the next "December 25" (Gregorian)
this.xmas = Calendar.daysUntilSolar(12, 25)
```

- Arguments are `(month, day)`. **If today is that date, returns 0**.
- If the date has already passed this year, it automatically rolls to next year (always a "future" count).
- If the target lunar month doesn't exist (e.g. there's no leap second month this year), it automatically searches forward to the nearest matching year.

| Method | Meaning |
|------|------|
| `daysUntilLunar(month, day)` | Days until the next lunar (month, day) |
| `daysUntilSolar(month, day)` | Days until the next Gregorian (month, day) |

## Days Between Any Two Dates

```js
// Days from now to a fixed Gregorian date
this.left = Calendar.daysFromNow("2026-10-01") // positive for future, negative for past

// Days between two specific dates (to - from)
this.span = Calendar.daysBetween("2026-01-01", "2026-05-15") // 134
```

Arguments support `YYYY-MM-DD` / `YYYY/MM/DD` / `YYYY.MM.DD`. Returns `0` if parsing fails.

| Method | Returns |
|------|------|
| `daysFromNow(ymd)` | `target - today`, positive for future, negative for past |
| `daysBetween(from, to)` | `to - from`, can be positive or negative |

## Gregorian to Lunar

Convert any Gregorian date to a lunar date string:

```js
console.log(Calendar.lunarFromSolar("2026-02-17"))
// "丙午正月初一"
```

Same format as `getLunarDate()` (`U`+`MMM`+`d`). Returns an empty string on parse failure.

## Calendar Events

```js
const result = await Calendar.getEvents()
const events = JSON.parse(result)
console.log(events)
```

Returns all events from now to one month later, as an array:

```json
[
  {
    "title": "Team Weekly",
    "startDate": "2026-05-03 10:00:00 +0000",
    "endDate":   "2026-05-03 11:00:00 +0000",
    "notes":     "Discuss Q2 plans",
    "color":     "FF6B6B"
  },
  ...
]
```

| Field | Description |
|------|------|
| `title` | Event title |
| `startDate` / `endDate` | Start / end time strings |
| `notes` | Event notes |
| `color` | Source calendar's color (hex) |

## Example: Show the Next 3 Events

```js
const result = await Calendar.getEvents()
const events = JSON.parse(result)
this.events = events.slice(0, 3)
```

On a vstack, set the loop data source to `{events[ev]}`. Inside:

| Child component | Content |
|--------|------|
| text | `{ev.title}` |
| text (gray) | `{ev.startDate}` |

## Permission Notes

The first time you call `getEvents()`, the system shows a "Calendar" access prompt.
**If the user denies access, subsequent calls return an error**:

```js
try {
  const result = await Calendar.getEvents()
  // ...
} catch (e) {
  console.log("Can't read calendar:", e)
}
```

iOS 17+ uses "Full Access" (`requestFullAccessToEvents`); older versions use the legacy API — behavior is identical.
