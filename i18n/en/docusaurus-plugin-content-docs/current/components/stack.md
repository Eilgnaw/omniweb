---
sidebar_position: 9
---

# Stack (Container)

A container **groups multiple children together**. There are four layout modes:

| Type | Layout | Use case |
|------|--------|----------|
| **vstack** | Vertical ↕ | Title + subtitle, list rows |
| **hstack** | Horizontal ↔ | Icon + text, left/right alignment |
| **zstack** | Layered ⊕ | Background image + foreground content |
| **tstack** | Rich text concatenation ✏️ | Mixed fonts / colors within a single text run |

## Common properties

| Property | Description |
|----------|-------------|
| Children | Any components inside, nestable |
| Spacing | Distance between children |
| Padding (padding/pacings) | Inner padding on 4 sides, e.g. `10,10,10,10` |
| Alignment | `center` / `leading` / `trailing` etc. |
| Background / Corner radius | Container background |
| Material (blur) | Frosted glass background (`thick` / `thin` / `regular`) |
| Rotation / Offset / Opacity | Visual tweaks |
| Open URL (openUrl) | Makes the whole container tappable — opens a URL when tapped. See [the dedicated section below](#openurl) |

## openurl

All stack containers (vstack / hstack / zstack / tstack / grid) support the **Open URL property**.
Once set, **the entire container becomes a tappable region**; when the user taps it, iOS opens the URL.

:::info Why on the container and not on a button?
The [button component](./button.md) **can only run JS — it can't open URLs** (it's built on AppIntent, a system limitation).
So "tap to navigate" is always done through stack containers.
:::

### Common URLs

| URL | Behavior |
|-----|----------|
| `https://2f0.cn` | Opens a web page |
| `weixin://` | Opens WeChat |
| `mailto:foo@bar.com` | Composes an email |
| `awidget://runjs/medium/{Widget.id}` | Re-runs the current widget's JS |
| `awidget://openmini?...` | Opens a WeChat Mini Program (the system appends `&from=omni` automatically) |
| `{link}` | Decided by your JS |

### Example: make a "button"

The simplest "button": a zstack + text + openUrl.

```
zstack (Open URL: https://2f0.cn)
  └─ text  ("Visit the site")
```

A bit fancier: icon + text + rounded background + navigation.

```
hstack (Background: blue, Corner radius: 10, Padding: 10,10,15,15, Open URL: weixin://)
  ├─ icon  (message.fill, white)
  └─ text  ("Open WeChat", white)
```

## vstack — Vertical

The most common. Children stack **top to bottom**.

```
┌─────────┐
│  text 1  │
│  text 2  │  ← vstack
│  icon    │
└─────────┘
```

## hstack — Horizontal

Children stack **left to right**. Combine with [spacer](./spacer.md) for "edge alignment".

```
[ icon | text | spacer | button ]   ← hstack
```

## zstack — Layered

Children are **stacked on top of each other** — later ones on top. Common uses:

- Background image + text
- Translucent overlay
- Progress bar (base color + progress color)

```
   ┌───────┐
   │  bg   │ ← first layer (background)
   │  txt  │ ← second layer (on top)
   └───────┘
```

## tstack — Rich text concatenation

Totally different from the other three — tstack **is not a layout container**. It glues multiple `text` children
**into a single continuous text run** (built on SwiftUI's `Text + Text`).
**Each segment can have its own font size / font / color, but everything is laid out and wrapped as a single piece of text.**

Three text components in a vstack / hstack are **3 independent Text views** — they wrap and align independently.
Three text components in a tstack are **1 single text run** — they won't wrap between segments, and the whole thing only wraps when the entire run is too long.

### Children

Only `text` is accepted (other types are ignored). **There's no separator between children** — if you want a space, add it inside the value.

### Example: big number + small unit

```
tstack:
  ├─ text  (content: "32",  size 36, color primary)
  └─ text  (content: "°C",  size 14, color gray)
```

Renders: **32**°C (big number, small unit, snug together). With an hstack, the small unit would be centered separately and float far from the number — not natural.

### Example: bold one word

```
tstack:
  ├─ text  (content: "You have ")
  ├─ text  (content: "{count}", large size, red color)
  └─ text  (content: " new messages")
```

Renders: `You have 5 new messages`, with the number standing out.

### Notes

- Want a **space between segments**? Add it to the start or end of the value — tstack won't add one for you.
- Want them to **wrap onto separate lines**? Use vstack, not tstack.
- tstack ignores icon / image / containers — only text is recognized.

## Containers can also loop

Any container (vstack / hstack / zstack / grid) can be given a **loop data source** to repeat its children **N times** over an array. See [Loop](./loop.md).

## Example: classic "icon + title + subtitle" card

```
hstack:
  ├─ icon (large)
  └─ vstack:
       ├─ text  ("Title")
       └─ text  ("Subtitle", small size, gray)
```

## Example: cover image + title (zstack)

```
zstack:
  ├─ image (cover, fill)
  └─ vstack:
       ├─ spacer
       └─ text ("Title", white)
```

Result: text floats at the bottom of the cover image.
