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
| Weight | A system symbol weight from `ultraLight` through `black`; placeholders are supported |
| Rendering mode | Monochrome, hierarchical, palette, or the SF Symbol's built-in multicolor design |
| Palette colors | Foreground, secondary, and tertiary colors used by Palette mode |
| Opacity | From `0` to `1` |
| Rotation / Offset | Changes the angle and position |
| Blend Mode | Mixes the icon with content below it; see [Visual effects](./visual-effects.md#blend-mode) |

## Symbol weight

Weight uses the system SF Symbols weights. Supported values, from lightest to heaviest, are:

```text
ultraLight / thin / light / regular / medium
semibold / bold / heavy / black
```

The default is `regular`. Weight supports placeholders. For example:

```js
this.symbolWeight = "bold"
```

Set Weight to `${symbolWeight}`. Unsupported values fall back to `regular`.

## Multicolor system symbols

Icon supports four SF Symbols rendering modes:

| Mode | Color source |
| --- | --- |
| `monochrome` | Uses the foreground color or gradient |
| `hierarchical` | Builds different emphasis levels from the foreground color |
| `palette` | Uses the foreground, secondary, and tertiary colors; the SF Symbol decides how many layers it uses |
| `multicolor` | Uses the SF Symbol's built-in system colors |

The rendering mode and palette colors all support placeholders. For example:

```js
this.symbolMode = "palette"
this.secondaryColor = "FF9500"
this.tertiaryColor = "34C759"
```

Set Rendering Mode to `${symbolMode}`, then use `${secondaryColor}` and `${tertiaryColor}` in the manual inputs for Secondary Color and Tertiary Color.

Not every SF Symbol has several color layers. If `multicolor` still looks monochrome, that symbol usually doesn't include a built-in multicolor design; use `palette` when you need custom colors.

## Example: show a weather symbol

```js
const weather = await Weather.current()
this.icon = weather.symbolName
```

Set the Icon content to `${icon}`. The `symbolName` from WeatherKit can be used directly.

:::tip Lock Screen widgets
Circular, rectangular, and inline Lock Screen widgets usually render in one color. Prefer a clear SF Symbol that doesn't depend on several colors to convey meaning.
:::
