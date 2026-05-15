---
sidebar_position: 3
---

# Icon (SF Symbols)

Displays an Apple SF Symbols system icon. No network needed, vector-scalable, and consistent with system visuals.

## Usage

Tap the ➕ in the top-right of the editor and add **icon**, then enter an SF Symbol name in the "content" field:

| Content | Result |
|---------|--------|
| `sun.max` | ☀ |
| `cloud.rain` | 🌧 |
| `heart.fill` | ♥ |
| `{icon}` | Decided by your JS |

The editor has a built-in SF Symbols picker (in the icon component's property panel) so you don't have to memorize names.

For the full icon library, see [Apple SF Symbols](https://developer.apple.com/sf-symbols/) (use the icon's English name).

## Common properties

| Property | Description |
|----------|-------------|
| Content | SF Symbol name (e.g. `bolt.fill`) |
| Width / Height | Display size |
| Color | Solid / gradient |
| Rotation / Offset | Effects |
| Opacity | 0~1 |

## Example: switch icon based on weather

```js
const result = await Weather.getCurrent()
const obj = JSON.parse(result)
this.icon = obj.symbolName    // Apple hands you the SF Symbol name directly
```

Set the icon component's content to `{icon}` — it automatically renders the matching weather icon.

:::tip Lock screen widgets
Lock screen circular / rectangular / inline widgets **only render single color**, which makes SF Symbols a perfect fit here.
:::
