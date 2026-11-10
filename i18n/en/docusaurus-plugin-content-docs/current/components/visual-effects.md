---
sidebar_position: 11
---

# Visual effects

Every component except Spacer supports Blur and Scale Effect. You can also apply them to a container, which affects all of its children together.

Text, Date, Icon, Shape, and Image also support Blend Mode, which mixes the current component's colors with the content below it.

## Blend Mode

Place a supported component in a ZStack above an image or shape. Blend Mode controls how the component is composited with the colors below it:

### Common modes

| Mode | Best for |
| --- | --- |
| `normal` | Regular rendering with no blending |
| `multiply` | Darkening colors for shadows and textures |
| `screen` | Lightening colors for glow effects |
| `overlay` | Keeping contrast while picking up colors underneath |
| `darken` | Keeping the darker color from the current layer or the layer below |
| `lighten` | Keeping the lighter color from the current layer or the layer below |
| `colorDodge` | Strongly brightening the colors below |
| `colorBurn` | Strongly darkening the colors below |
| `softLight` | A gentler version of `overlay` |
| `hardLight` | A stronger version of `overlay` |
| `difference` | High contrast based on the difference between colors |
| `exclusion` | A softer contrast effect than `difference` |
| `hue` | Using the current layer's hue while keeping saturation and luminosity below |
| `saturation` | Using the current layer's saturation while keeping hue and luminosity below |
| `color` | Using the current layer's hue and saturation while keeping luminosity below |
| `luminosity` | Using the current layer's luminosity while keeping hue and saturation below |
| `plusDarker` | Adding colors with a darker result |
| `plusLighter` | Adding colors with a lighter result |

### Advanced compositing modes

| Mode | What it does |
| --- | --- |
| `sourceAtop` | Shows the current component only where content already exists below it |
| `destinationOver` | Places the current component behind the content below; it may disappear behind an opaque layer |
| `destinationOut` | Uses the current component's opacity to erase the content below |

:::warning Advanced modes change the alpha below them
Use advanced compositing modes inside a ZStack. Omni creates an isolated compositing group for a ZStack that contains these modes, keeping erasure from affecting content outside that ZStack. Isolation uses some extra rendering memory, so don't apply it throughout a large Grid.
:::

Blend Mode supports placeholders. This setup lets JavaScript choose the mode:

```js
this.blend = "overlay"
```

Set the component's Blend Mode to `${blend}`. Unsupported values fall back to `normal`.

## Blur

| Property | Values | What it does |
| --- | --- | --- |
| Radius | `0` to `50`, or `${variable}` | Gaussian blur radius; `0` disables it |
| Opaque | `true`, `false`, or `${variable}` | Whether the blurred output must remain fully opaque |

Use `Opaque = false` when a transparent blur edge should blend into a neighboring image. Use `Opaque = true` to avoid transparent edges when a harder boundary is acceptable.

:::warning Blur increases widget memory use
Prefer blurring one container instead of applying a large Radius to many Grid children. Widget extensions have a tight memory limit, so test complex layouts on a device.
:::

## Scale Effect

| Property | Default | What it does |
| --- | --- | --- |
| X | `1` | Horizontal scale; a negative value flips horizontally |
| Y | `1` | Vertical scale; a negative value flips vertically |
| Anchor | `center` | Anchor used for scaling and flipping |

Anchor supports:

```text
center
leading / trailing / top / bottom
topLeading / topTrailing / bottomLeading / bottomTrailing
```

Common combinations:

| Effect | X | Y |
| --- | --- | --- |
| Flip horizontally | `-1` | `1` |
| Flip vertically | `1` | `-1` |
| Flip both axes | `-1` | `-1` |
| Reset | `1` | `1` |

Scale Effect changes rendering without changing the component's occupied size inside a Stack. A negative scale on a container also flips its text.

## Use JavaScript variables

Every Blur and Scale Effect property supports placeholders:

```js
this.blurRadius = 20
this.blurOpaque = false
this.scaleX = -1
this.scaleY = 1
this.scaleAnchor = "center"
```

Set these values in the property panel:

| Property | Value |
| --- | --- |
| Radius | `${blurRadius}` |
| Opaque | `${blurOpaque}` |
| X | `${scaleX}` |
| Y | `${scaleY}` |
| Anchor | `${scaleAnchor}` |

Invalid values fall back safely: Radius uses `0`, Opaque uses `false`, X/Y use `1`, and Anchor uses `center`.

## Example: blend a sharp cover into a blurred background

In a medium `338 × 158` widget, add an HStack:

```text
hstack (spacing -60)
├─ image (158 × 158, fill)
└─ image (240 × 158, fill; Radius 20; Opaque false; X -1; Y 1)
```

The right image overlaps the left by `60` points, three times the blur radius. The transparent blur edge stays over the sharp image and reaches a stable blur by the original image boundary.
