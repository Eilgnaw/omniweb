---
sidebar_position: 9
---

# Calendar

`Calendar` reads system calendar events for the next month and provides lunar-date and date-difference helpers.

| Goal | Use |
| --- | --- |
| Read calendar events | `Calendar.getEvents()` |
| Display today's lunar date | `Calendar.lunarDate()` |
| Count down to a birthday or holiday | `daysUntilSolar()` / `daysUntilLunar()` |
| Count days between dates | `daysBetween()` / `daysFromNow()` |

## Read events for the next month

```js
try {
  const result = await Calendar.getEvents()
  const events = JSON.parse(result)
  this.events = events.slice(0, 3)
} catch (error) {
  console.error("Couldn't read calendar:", error)
  this.events = []
}
```

Each event contains:

| Field | Content |
| --- | --- |
| `title` | Title |
| `startDate` / `endDate` | Start / end time strings |
| `notes` | Notes |
| `color` | Source calendar color as hex |

Set a VStack's Data Source to `${events[event]}`. Its children can display `${event.title}` and `${event.startDate}`.

:::warning Authorize in the main app first
The first `getEvents()` call asks for Full Access to Calendar. A background widget can't show the permission prompt, so run it once in the editor and finish authorization there.
:::

## Display today's lunar date

```js
this.fullLunar = Calendar.lunarDate()
this.shortLunar = Calendar.getLunarDate()
```

- `lunarDate()` returns a more complete Chinese date.
- `getLunarDate()` returns a compact sexagenary year, month, and day string.

## Read lunar components

```js
this.year = Calendar.lunarYear()            // 1...60 in the sexagenary cycle
this.month = Calendar.lunarMonth()          // 1...12
this.day = Calendar.lunarDay()              // 1...30
this.isLeap = Calendar.isLunarLeapMonth()   // true / false
this.zodiac = Calendar.zodiac()             // Chinese zodiac
this.ganZhi = Calendar.ganZhi()             // Heavenly Stems and Earthly Branches
```

`lunarYear()` isn't a Gregorian year. Use `ganZhi()` when you need text such as “甲辰” or “丙午”.

## Count down to the next holiday

```js
this.springFestival = Calendar.daysUntilLunar(1, 1)
this.christmas = Calendar.daysUntilSolar(12, 25)
```

Arguments are month and day. The target date returns `0`; after it passes, the function counts to next year.

## Calculate date differences

```js
this.daysLeft = Calendar.daysFromNow("2030-01-01")
this.span = Calendar.daysBetween("2030-01-01", "2030-05-15")
```

- `daysFromNow()` returns target minus today: future is positive, past is negative.
- `daysBetween()` returns the second date minus the first.
- Dates may use `YYYY-MM-DD`, `YYYY/MM/DD`, or `YYYY.MM.DD`. A parse failure returns `0`.

## Convert Gregorian to lunar

```js
this.lunar = Calendar.lunarFromSolar("2030-02-03")
```

A parse failure returns an empty string.

## Quick reference

```js
Calendar.getEvents() → Promise<string>
Calendar.lunarDate() → string
Calendar.getLunarDate() → string
Calendar.lunarYear() → number
Calendar.lunarMonth() → number
Calendar.lunarDay() → number
Calendar.isLunarLeapMonth() → boolean
Calendar.zodiac() → string
Calendar.ganZhi() → string
Calendar.daysUntilLunar(month, day) → number
Calendar.daysUntilSolar(month, day) → number
Calendar.daysFromNow(ymd) → number
Calendar.daysBetween(from, to) → number
Calendar.lunarFromSolar(ymd) → string
```
