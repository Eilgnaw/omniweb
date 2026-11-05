---
sidebar_position: 1
---

# Text

Use Text for titles, numbers, labels, or values returned by JavaScript.

## Quick start

1. Tap `+` in the top-right of the editor and add **text**.
2. Enter fixed text or a placeholder in Content.

| Content | Result |
| --- | --- |
| `Hello` | Hello |
| `${name}` | The value of `this.name` |
| `Hi ${name}. It's ${temp}°.` | Fixed text and variables together |

See [Placeholder syntax](../getting-started/placeholder.md) for all supported forms.

## Common properties

| Property | What it does |
| --- | --- |
| Content | The text or placeholder to display |
| Font size | A fixed number or placeholder such as `${size}` |
| Font | A system or custom font |
| Color | A solid or gradient foreground |
| Line count | `0` means unlimited; `1` means one line |
| Scale factor | How far long text may shrink to fit |
| Truncation | Removes the head, middle, or tail if text still doesn't fit |
| Alignment | Leading, centered, or trailing |
| Background and corner radius | Styles the area behind the text |
| Rotation and offset | Changes the text's angle and position |

## Example: show two JS values

```js
this.title = "Unread"
this.count = 12
```

| Use | Content |
| --- | --- |
| Title | `${title}` |
| Number | `${count}` |
| Combined | `${title}: ${count} messages` |

:::tip When text doesn't fit
Set the line count first, then tune the scale factor and truncation. Starting with a tiny font makes short content lose its visual hierarchy too.
:::
