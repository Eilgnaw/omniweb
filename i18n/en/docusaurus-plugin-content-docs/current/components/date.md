---
sidebar_position: 6
---

# Date

Displays a date / time / timer. Uses iOS's `Text(date:)` API — **the system refreshes it every second** without any JS involvement.

## Usage

Tap the ➕ in the top-right of the editor and add **date**, then fill the date source into the "content" field.

### What the content field accepts

| Content | Meaning |
|---------|---------|
| `now` | Now |
| `tomorrow` | This time tomorrow |
| `yesterday` | This time yesterday |
| `startoftoday` | Today at 00:00 |
| `2024-08-20 10:00:00` | A specific moment (format must be exact) |
| `{ts}` | Placeholder — JS supplies a time string |

## Display styles

The "style" field in the property panel decides how it renders:

| Style | Result (using 14:30) |
|-------|----------------------|
| `time` | `2:30 PM` clock |
| `date` | `August 20, 2024` date |
| `relative` | `5 minutes ago` relative time |
| `offset` | `+05:00` time offset |
| `timer` | `00:05:00` countdown / count-up |

## Example: countdown to a specific time

```js
this.target = "2026-01-01 00:00:00"
```

Date component:
- Content: `{target}`
- Style: `timer`
- → Displays the time remaining until New Year's Day 2026, **auto-refreshing**

## Example: dynamic timer

```js
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(0, 0, 0, 0)

const fmt = (d) => {
  const p = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}
this.next = fmt(tomorrow)
```

Set the date component's content to `{next}` and style to `timer` — it shows a countdown to midnight tomorrow.

:::tip Why can date refresh every second?
Widgets can't refresh every second on their own, but `Text(date:)` is system-level — iOS drives this clock under the hood.
For other "live" displays, see [Live Activities](../api/control.md#live-activity-control).
:::

## About clipping

The date component supports four-direction clipping (leading / trailing / top / bottom), which can produce effects like "show only the digits, hide the colon". This is for visual tweaking — feel free to skip it for everyday use.
