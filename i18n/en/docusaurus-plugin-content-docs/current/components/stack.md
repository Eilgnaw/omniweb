---
sidebar_position: 9
---

# Stack containers

Stack groups several children into one layout. Choose the container by direction:

| Type | Layout | Common uses |
| --- | --- | --- |
| `vstack` | Top to bottom | Titles and captions, vertical lists |
| `hstack` | Left to right | Icons with text, edge alignment |
| `zstack` | Layers front to back | Background images, overlays, layered effects |
| `tstack` | One continuous text run | Mixed sizes, fonts, or colors on one line |

## Common properties

| Property | What it does |
| --- | --- |
| Children | Holds any components, including nested containers |
| Spacing | Distance between children |
| Padding | Space on four edges, such as `10,10,10,10` |
| Width / Height | Follows the content when empty; a positive value fixes the container size |
| Alignment | `center`, `leading`, `trailing`, and more |
| Background / Corner radius | Styles the entire container |
| Material | `thick`, `thin`, or `regular` blur material |
| Rotation / Offset / Opacity | Changes the whole container |
| Blur / Scale Effect | Blurs, scales, or flips the container and all of its children; see [Visual effects](./visual-effects.md) |
| Open URL | Makes the entire container tappable |

## Choose a layout

### VStack: vertical

```text
vstack
├─ text (title)
├─ text (caption)
└─ icon
```

### HStack: horizontal

```text
hstack
├─ icon
├─ text
├─ spacer
└─ text
```

Pair it with [Spacer](./spacer.md) to push content to opposite sides.

### ZStack: layered

Children are layered in order, with later children in front:

```text
zstack
├─ image (background)
└─ text (foreground)
```

Use it for backgrounds, translucent overlays, and progress bars made from two shapes.

### Fix the container size and let text shrink

To keep a capsule or badge at a fixed width, set a width on the outer ZStack, then make the inner Text single-line with a scale factor:

```text
zstack (width: 60; clip shape: Capsule)
└─ text (line count: 1; scale factor: 0.5; padding: 5,8,5,8)
```

Short text keeps its original font size. Long text shrinks within 60pt instead of expanding the capsule. Set width or height to `0`, or clear it, to follow the content again.

### TStack: rich text

TStack accepts only Text children. It joins them into one continuous text run instead of laying them out as separate views.

```text
tstack
├─ text ("32", size 36)
└─ text ("°C", size 14)
```

The result is a tightly joined `32°C`, with separate styling for each segment.

When using TStack:

- It doesn't insert spaces. Include them in Content yourself.
- It only accepts Text. Icon, Image, and containers are ignored.
- Use VStack or HStack when you need separate lines or alignment.

## Make a container tappable

Set Open URL on a `vstack`, `hstack`, `zstack`, `tstack`, or `grid` to turn the whole container into a tap target.

| URL | Result after a tap |
| --- | --- |
| `https://2f0.cn` | Opens a website |
| `weixin://` | Opens WeChat |
| `mailto:foo@bar.com` | Starts an email |
| `omniwidgets://runjs/medium/{Widget.id}` | Runs the current medium widget's JS again |
| `omniwidgets://openmini?...` | Opens a WeChat Mini Program |
| `${link}` | Uses a URL supplied by JavaScript |

`omniwidgets://` and the older `awidget://` behave the same. Existing links don't need to change.

### Example: a button-like link

```text
hstack (background: blue; corner radius: 10; padding: 10; Open URL: weixin://)
├─ icon (message.fill, white)
└─ text (Open WeChat, white)
```

:::info Navigation and code are different actions
Open URL on a Stack handles navigation. [Button](./button.md) runs JavaScript. Choose based on what should happen after the tap.
:::

## Repeat a container over an array

VStack, HStack, ZStack, and Grid can use a Data Source to repeat their children for an array. See [Loop](./loop.md).

## Example: icon, title, and caption

```text
hstack
├─ icon
└─ vstack
   ├─ text (title)
   └─ text (caption, small and gray)
```

## Example: title over a cover image

```text
zstack
├─ image (fills the container)
└─ vstack
   ├─ spacer
   └─ text (title, white)
```
