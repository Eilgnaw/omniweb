---
sidebar_position: 4
---

# Shape

Draws a geometric shape. Useful for decoration, backgrounds, dividers, and progress bar bases.

## Usage

Tap the ➕ in the top-right of the editor and add **shape**, then pick a shape name in the "content" field:

| Content | Shape |
|---------|-------|
| `circle` | Circle ⚫ |
| `rectangle` | Rectangle |
| `roundedrectangle` | Rounded rectangle |
| `ellipse` | Ellipse |
| `capsule` | Capsule |

## Common properties

| Property | Description |
|----------|-------------|
| Width / Height | Size |
| Color | Fill color, supports gradients |
| Corner radius | Rounded rectangle only |
| Rotation / Offset | Effects |
| Opacity | 0~1 |

## Example: a simple progress bar

A **zstack** containing two shapes:

| Layer | Type | Width | Color |
|-------|------|-------|-------|
| Bottom | rectangle | 100 | Gray |
| Top | rectangle | `{percent}` | Theme color |

In JS, set `this.percent = 60` → the bar fills to 60%.

:::tip Want something more polished?
Try [Gauge](./gauge.md) — rings, arcs, and progress bars all come with built-in styling.
:::
