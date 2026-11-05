---
sidebar_position: 6
---

# Date

Date displays a date, time, relative time, or timer. It uses system-driven time text, so it can keep updating without running JavaScript on every tick.

## Quick start

1. Add **date**.
2. Enter a time source in Content.
3. Choose a display Style.

### Content

| Content | Meaning |
| --- | --- |
| `now` | Current time |
| `tomorrow` | This time tomorrow |
| `yesterday` | This time yesterday |
| `startoftoday` | Today at 00:00 |
| `2030-01-01 00:00:00` | A specific time; the format must match exactly |
| `${target}` | A time string supplied by JavaScript |

### Styles

| Style | Displays |
| --- | --- |
| `time` | A clock, such as `2:30 PM` |
| `date` | A date |
| `relative` | Relative time, such as “5 minutes ago” |
| `offset` | A time difference, such as `+05:00` |
| `timer` | A countdown or count-up, such as `00:05:00` |

## Example: count down to a fixed time

```js
this.target = "2030-01-01 00:00:00"
```

Date setup:

- Content: `${target}`
- Style: `timer`

## Example: count down to midnight

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

Set Content to `${target}` and Style to `timer`.

:::tip Why can it keep updating?
Regular widgets can't run JS every second, but iOS updates Date text itself. For other ongoing values, use a [Live Activity](../api/control.md).
:::

## Clipping

Date can clip from the top, bottom, leading, or trailing edge. Use this to hide part of a timer. You can ignore these options for ordinary layouts.
