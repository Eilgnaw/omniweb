---
sidebar_position: 10
---

# Grid

Grid arranges content in a fixed number of columns and wraps when a row is full. Use it for icon panels, photo walls, and multi-day forecasts.

## Quick start

1. Add **grid**.
2. Set Columns.
3. Add the children you want to arrange.

With `columns = 3` and 7 items:

```text
1  2  3
4  5  6
7
```

## Common properties

| Property | What it does |
| --- | --- |
| Columns | Number of items in each row |
| Spacing | Distance between grid items |
| Alignment | Placement of an incomplete final row |
| Padding / Background / Corner radius | Styles the whole grid container; use one radius or set each corner separately |

After choosing Rounded Rectangle as the clip shape, tap the edit button beside Corner Radius to set the top-leading, top-trailing, bottom-leading, and bottom-trailing corners separately. The plus and minus buttons change all four corners together.

Each corner can bind to a `${variable}` with the variable button. The variable must resolve to a number; invalid values and values below `0` are treated as `0`. The shared plus and minus buttons are disabled while a corner uses a variable.

## Example: a two-column weather grid

JavaScript:

```js
this.items = [
  { icon: "sun.max", label: "Sunny" },
  { icon: "cloud", label: "Cloudy" },
  { icon: "cloud.rain", label: "Rain" },
  { icon: "snow", label: "Snow" }
]
```

Grid setup:

- Columns: `2`
- Data Source: `${items[item]}`
- Child: one `vstack` containing `${item.icon}` and `${item.label}`

You only design one grid item. Omni repeats it to match the array. See [Loop](./loop.md) for the full rules.
