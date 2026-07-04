---
sidebar_position: 10
---

# Grid

Arranges children in **a fixed number of columns**, wrapping automatically. Great for evenly-sized items.

## Usage

Tap the ➕ in the top-right of the editor and add **grid**, then add children inside. Set **columns** in its properties.

```
columns = 3
7 children:

┌─┬─┬─┐
│1│2│3│
├─┼─┼─┤
│4│5│6│
├─┼─┼─┤
│7│ │ │
└─┴─┴─┘
```

## Common properties

| Property | Description |
|----------|-------------|
| Columns | Items per row |
| Spacing | Spacing between children |
| Padding / Background / Corner radius | Same as other containers |
| Alignment | How children align when a row isn't full |

## Pair with loop

Grid is usually combined with [Loop](./loop.md) — define one child template, and the array's length decides how many cells get drawn.

```js
this.icons = [
  { sym: "sun.max",   label: "Sunny" },
  { sym: "cloud",     label: "Cloudy" },
  { sym: "cloud.rain",label: "Rain" },
  { sym: "snow",      label: "Snow" }
]
```

Grid setup:
- Columns: `2`
- Data source: `${icons[ico]}`
- Children (vstack):
  - icon  content `${ico.sym}`
  - text  content `${ico.label}`

Result: a 2-column, 2-row grid of weather icons.
