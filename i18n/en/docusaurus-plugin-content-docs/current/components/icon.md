---
sidebar_position: 3
---

# Icon

Use Icon to display Apple's SF Symbols. They don't need a network connection, scale cleanly, and match the system design.

## Quick start

1. Add **icon**.
2. Pick an SF Symbol in the property panel, or enter its name in Content.

| Content | Result |
| --- | --- |
| `sun.max` | Sun symbol |
| `cloud.rain` | Rain cloud symbol |
| `heart.fill` | Filled heart |
| `${icon}` | Chosen by JavaScript |

You don't need to memorize names: the editor includes a picker. You can also browse [Apple SF Symbols](https://developer.apple.com/sf-symbols/).

## Common properties

| Property | What it does |
| --- | --- |
| Content | The SF Symbol name, such as `bolt.fill` |
| Width / Height | Symbol size |
| Color | Solid or gradient color |
| Opacity | From `0` to `1` |
| Rotation / Offset | Changes the angle and position |

## Example: show a weather symbol

```js
const result = await Weather.getCurrent()
const weather = JSON.parse(result)
this.icon = weather.symbolName
```

Set the Icon content to `${icon}`. The `symbolName` from WeatherKit can be used directly.

:::tip Lock Screen widgets
Circular, rectangular, and inline Lock Screen widgets usually render in one color. Prefer a clear SF Symbol that doesn't depend on several colors to convey meaning.
:::
