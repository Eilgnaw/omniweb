---
sidebar_position: 1
---

# Text

The most-used component. Displays a piece of text.

## Usage

Tap the ➕ in the top-right of the editor and add **text**, then write what you want to display in the "content" field. It can be fixed text, a placeholder, or a mix of both.

| Content field | Result |
|---------------|--------|
| `Hello` | Hello |
| `{name}` | Shows the value of `this.name` from your JS |
| `Hi {name}, it's {temp}° today` | Hi Alice, it's 26° today |

For full placeholder syntax, see [Placeholder syntax](../getting-started/placeholder.md).

## Common properties

| Property | Description |
|----------|-------------|
| Content | The text / placeholder to display |
| Font size | Text size — a fixed number or a placeholder |
| Font | System font or a custom font |
| Color | Foreground color; supports solid or gradient |
| Line count | No limit by default (0 = unlimited); set to 1 for single line |
| Scale factor | Default 0.9 — when text is too long, it shrinks proportionally to fit |
| Truncation mode | When text is too long and can't shrink further, where to clip from (head / middle / tail) |
| Alignment | Center / leading / trailing |
| Rotation / Offset | For special effects |
| Background color | Text background, transparent by default |
| Corner radius | Adds rounded corners to the background |

:::tip Font size can be dynamic too
Writing `{size}` in the font size field works — set `this.size = 18` in JS to control the size dynamically.
:::

## Example: display one row of JS data

```js
this.title = "Unread"
this.count = 12
```

| Component | Content |
|-----------|---------|
| text | `{title}` |
| text | `{count}` |
| text (mixed) | `{title}: {count} messages` |
