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
| Corner radius | Rounded rectangles only; use one radius or set each corner separately |
| Opacity | From `0` to `1` |
| Rotation / Offset | Changes the angle and position |
| Blend Mode | Mixes the shape with content below it; see [Visual effects](./visual-effects.md#blend-mode) |

After choosing `roundedrectangle`, tap the edit button beside Corner Radius to set the top-leading, top-trailing, bottom-leading, and bottom-trailing corners separately. The plus and minus buttons change all four corners together.

Each corner can bind to a `${variable}` with the variable button. The variable must resolve to a number; invalid values and values below `0` are treated as `0`. The shared plus and minus buttons are disabled while a corner uses a variable.

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
