---
sidebar_position: 7.5
---

# Canvas

Canvas draws graphics from JSON commands. Use it for progress rings, line and bar charts, badges, dashboards, and outlined text.

## When should you use Canvas?

| Need | Recommended component |
| --- | --- |
| Ordinary text, images, or symbols | The matching Text, Image, or Icon component |
| A system-style progress ring or bar | Gauge |
| One graphic driven by several values, a path, or a special text effect | Canvas |

Canvas doesn't execute arbitrary drawing code. The editor preview, Home Screen widget, and Live Activity all render the same commands.

## Quick start

1. Add **Canvas**. A new Canvas starts with a `75%` gradient progress ring.
2. Open Drawing Commands.
3. Edit the JSON, format and validate it, then return to the preview.

Every command needs an `op`:

```json
[
  {
    "op": "circle",
    "x": 50,
    "y": 50,
    "radius": 40,
    "fill": "#0A59F7"
  }
]
```

Commands draw in array order, so later content appears on top.

## Put variables into commands

Individual fields can use placeholders:

```json
[
  {
    "op": "text",
    "text": "${title}",
    "x": "${labelX}",
    "y": 20
  }
]
```

Place the cursor on a field value and use Insert Variable to avoid missing JSON quotes.

### Generate the whole command list in JS

```js
this.drawing = [
  {
    op: "circle",
    x: 50,
    y: 50,
    radius: 40,
    fill: "#0A59F7"
  },
  {
    op: "text",
    text: "75%",
    x: 50,
    y: 50,
    size: 18,
    fill: "#FFFFFF",
    align: "center",
    baseline: "middle"
  }
]
```

In Insert Variable, choose Bind Entire Array and select `drawing`. The result is `${drawing}`. Don't use the loop form `${drawing[item]}`.

## Coordinates and display size

| Property | Example | What it does |
| --- | --- | --- |
| Drawing Commands | `${drawing}` / JSON array | Commands executed in order |
| Coordinate Width | `120` | Horizontal range of the virtual drawing space |
| Coordinate Height | `120` | Vertical range of the virtual drawing space |
| Scaling Mode | `fit` / `stretch` | Maps virtual coordinates to the component size |
| Width / Height | `120` | Actual Canvas size in the layout |

For a `100 × 100` coordinate space displayed in a `200 × 100` component:

- `fit`: preserves the aspect ratio and centers horizontally.
- `stretch`: scales X by 2 and leaves Y unchanged.

Background, clipping, shadow, rotation, offset, opacity, and visibility apply to the whole Canvas.

## Primitives

| `op` | Main fields | Use |
| --- | --- | --- |
| `rect` / `roundRect` | `x`, `y`, `width`, `height`, `radius` | Rectangle or rounded rectangle |
| `circle` | `x`, `y`, `radius` | Circle |
| `arc` | `x`, `y`, `radius`, `start`, `end`, `counterClockwise`, `close` | Arc; angles use degrees |
| `line` | `x1`, `y1`, `x2`, `y2` | Line |
| `polyline` | `points`, `close` | Polyline or polygon |
| `path` | `segments` | Compound path |
| `text` | `text`, `x`, `y`, `size` | Text |
| `clear` | `x`, `y`, `width`, `height` | Clear an area; omit the size to clear the whole Canvas |

### Polyline

`points` accepts `[x, y]` or `{x, y}`:

```js
this.drawing = [
  {
    op: "polyline",
    points: [[8, 72], [28, 42], [52, 58], [76, 20], [96, 36]],
    stroke: "#0A59F7",
    lineWidth: 4,
    lineCap: "round",
    lineJoin: "round"
  }
]
```

### Compound path

`segments` supports `move`, `line`, `quadratic`, `bezier`, `arc`, and `close`:

```js
this.drawing = [
  {
    op: "path",
    segments: [
      { op: "move", x: 10, y: 70 },
      { op: "quadratic", cx: 50, cy: 5, x: 90, y: 70 },
      { op: "line", x: 10, y: 70 },
      { op: "close" }
    ],
    fill: "#0A59F7"
  }
]
```

## State, transforms, and clipping

| `op` | Fields | What it does |
| --- | --- | --- |
| `save` / `restore` | None | Save or restore the current transform and clip |
| `translate` | `x`, `y` | Move later commands |
| `rotate` | `angle`, `x`, `y` | Rotate later commands around a point |
| `scale` | `scaleX`, `scaleY`, `value`, `x`, `y` | Scale later commands around a point |
| `clipRect` | `x`, `y`, `width`, `height`, `radius` | Clip to a rectangle or rounded rectangle |
| `clipCircle` | `x`, `y`, `radius` | Clip to a circle |

A clip keeps affecting later commands. For a local clip, put `save` before it and `restore` after it.

## Fill, stroke, and effects

| Field | Example | What it does |
| --- | --- | --- |
| `fill` | `"#0A59F7"` | Fill; `"none"` disables it |
| `stroke` | `"#FFFFFF"` | Stroke; `"none"` disables it |
| `lineWidth` | `4` | Stroke width |
| `lineCap` | `"butt"` / `"round"` / `"square"` | Line endings |
| `lineJoin` | `"miter"` / `"round"` / `"bevel"` | Line joins |
| `miterLimit` | `10` | Miter limit |
| `dash` | `[6, 4]` | Dash pattern |
| `dashOffset` | `2` | Dash start offset |
| `alpha` | `0.6` | Opacity for this command |
| `shadowColor` | `"#00000055"` | Shadow color |
| `shadowBlur` | `8` | Shadow blur |
| `shadowX` / `shadowY` | `0` / `4` | Shadow offset |
| `composite` | `"source-over"` | Blend mode |

Supported blend modes: `source-over`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `destination-out`, and `copy`. Unknown values fall back to `source-over`.

## Text

Text can use fill and stroke together. Canvas draws the stroke first, then the fill:

```js
this.drawing = [
  {
    op: "text",
    text: "Omni Widgets",
    x: 60,
    y: 60,
    size: 22,
    weight: "700",
    stroke: "#0A59F7",
    lineWidth: 2,
    fill: "#FFFFFF",
    align: "center",
    baseline: "middle"
  }
]
```

Other text fields:

- `weight`: `"normal"`, `"bold"`, `"700"`, and more.
- `fontStyle`: `"normal"`, `"italic"`, or `"oblique"`.
- `fontFamily`: font name.
- `align`: `"left"`, `"center"`, `"right"`, `"start"`, or `"end"`.
- `baseline`: `"top"`, `"middle"`, `"bottom"`, `"alphabetic"`, `"hanging"`, or `"ideographic"`.
- `maxWidth`: maximum drawing width.

Color Emoji render normally as filled text, but don't receive a regular glyph stroke.

## Color, appearance, and gradients

Solid colors accept `#RRGGBB` and `#RRGGBBAA`. You can provide separate light and dark values:

```js
const adaptiveText = {
  light: "#162033",
  dark: "#F7FAFF"
}
```

Linear gradient:

```js
const gradient = {
  type: "linear",
  x0: 0,
  y0: 0,
  x1: 100,
  y1: 100,
  stops: [
    { offset: 0, color: "#53C8FF" },
    { offset: 1, color: "#0A59F7" }
  ]
}
```

A radial gradient uses `type: "radial"` with `x0`, `y0`, `r0`, `x1`, `y1`, and `r1`. For consistent results across supported iOS versions, use the same center for the start and end circles.

## Limits

| Item | Maximum |
| --- | ---: |
| Commands in one Canvas | 100 |
| Points in one `polyline` | 200 |
| Segments in one `path` | 200 |
| Stops in one gradient | 16 |
| `save` stack depth | 20 |
| Items in one `dash` array | 20 |
| Virtual coordinate width or height | 4000 |

:::warning Canvas isn't an animation loop
It redraws when commands, size, or appearance changes. It doesn't provide a game loop or per-frame callback. Widget refreshes still follow iOS scheduling.
:::

:::tip Invalid content fails safely
Unknown `op` values are skipped, invalid fields fall back to safe defaults, and content beyond a limit is truncated. The current version can't draw images inside Canvas commands.
:::
