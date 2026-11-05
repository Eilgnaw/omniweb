---
sidebar_position: 4
---

# Shape

Use Shape for backgrounds, dividers, dots, capsules, and simple progress bars.

## Quick start

1. Add **shape**.
2. Choose a shape in Content.
3. Set its width, height, and color.

| Content | Shape |
| --- | --- |
| `circle` | Circle |
| `rectangle` | Rectangle |
| `roundedrectangle` | Rounded rectangle |
| `ellipse` | Ellipse |
| `capsule` | Capsule |

## Common properties

| Property | What it does |
| --- | --- |
| Width / Height | Shape size |
| Color | Solid or gradient fill |
| Corner radius | Rounded rectangles only |
| Opacity | From `0` to `1` |
| Rotation / Offset | Changes the angle and position |

## Example: a simple progress bar

Layer two rectangles in a `zstack`:

| Layer | Content | Width | Color |
| --- | --- | --- | --- |
| Back | `rectangle` | `100` | Gray |
| Front | `rectangle` | `${percent}` | Accent color |

```js
this.percent = 60
```

The front rectangle becomes 60 points wide, producing a 60% progress bar.

:::tip Need a system-style indicator?
Use [Gauge](./gauge.md). For lines, arcs, or multi-part graphics, use [Canvas](./canvas.md).
:::
