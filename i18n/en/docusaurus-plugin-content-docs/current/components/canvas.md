---
sidebar_position: 7.5
---

# Canvas

Canvas draws graphics from a list of JSON commands. It's a good fit for progress rings, line and bar charts, badges, dashboards, and outlined text. It doesn't execute arbitrary drawing code. The same commands render in the editor preview, home screen widgets, and Live Activities.

## Usage

Tap the ➕ in the top-right of the editor and add **Canvas**. A new Canvas starts with a `75%` gradient progress ring.

Open **Drawing Commands** to:

- Edit a JSON array directly.
- Format and validate the JSON.
- Place the cursor at a field value and choose **Insert Variable**.
- Choose **Bind Entire Array** to generate `${drawing}`.
- Restore the default example.

Individual command fields can also bind variables:

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

When the cursor is inside an existing string, the editor inserts only `${title}`. Outside a string, it adds the JSON quotes automatically.

For data-driven graphics, build an array in JS:

```js
this.drawing = [
  {
    op: "circle",
    x: 50,
    y: 50,
    radius: 40,
    fill: "#0A59F7",
  },
  {
    op: "text",
    text: "75%",
    x: 50,
    y: 50,
    size: 18,
    fill: "#FFFFFF",
    align: "center",
    baseline: "middle",
  },
]
```

Then open the **Insert Variable** menu, choose **Bind Entire Array**, and select `drawing`. This binds the **whole array**. It isn't a loop data source, so don't use `${drawing[item]}`.

## Properties

| Property | Example | Description |
|---|---|---|
| Drawing Commands | `${drawing}` / JSON array | Drawn from first to last |
| Coordinate Width | `120` / `${viewWidth}` | Horizontal range of the virtual coordinate system |
| Coordinate Height | `120` / `${viewHeight}` | Vertical range of the virtual coordinate system |
| Scaling Mode | `fit` / `stretch` | `fit` preserves aspect ratio and centers; `stretch` fills each axis independently |
| Width / Height | `120` | Actual component size |
| Background, clipping, shadow | Standard editor properties | Applied to the whole Canvas component |
| Rotation, offset, opacity, visibility | Standard editor properties | Applied to the whole Canvas component |

Coordinate width and height define the drawing space. Width and height define the component's actual layout size. For a `100 × 100` coordinate space displayed at `200 × 100`:

- `fit`: preserves the aspect ratio and centers horizontally.
- `stretch`: scales X by 2 and leaves Y unchanged.

## Primitives

Every command needs an `op`:

| `op` | Main fields | Purpose |
|---|---|---|
| `rect` / `roundRect` | `x`, `y`, `width`, `height`, `radius` | Rectangle or rounded rectangle |
| `circle` | `x`, `y`, `radius` | Circle |
| `arc` | `x`, `y`, `radius`, `start`, `end`, `counterClockwise`, `close` | Arc; angles use degrees |
| `line` | `x1`, `y1`, `x2`, `y2` | Line |
| `polyline` | `points`, `close` | Polyline or polygon |
| `path` | `segments` | Compound path |
| `text` | `text`, `x`, `y`, `size` | Text |
| `clear` | `x`, `y`, `width`, `height` | Clear a region; omit the size to clear the virtual canvas |

`polyline.points` accepts `[x, y]` or `{x, y}`:

```js
this.drawing = [
  {
    op: "polyline",
    points: [[8, 72], [28, 42], [52, 58], [76, 20], [96, 36]],
    stroke: "#0A59F7",
    lineWidth: 4,
    lineCap: "round",
    lineJoin: "round",
  },
]
```

`path.segments` supports `move`, `line`, `quadratic`, `bezier`, `arc`, and `close`:

```js
this.drawing = [
  {
    op: "path",
    segments: [
      { op: "move", x: 10, y: 70 },
      { op: "quadratic", cx: 50, cy: 5, x: 90, y: 70 },
      { op: "line", x: 10, y: 70 },
      { op: "close" },
    ],
    fill: "#0A59F7",
  },
]
```

## State, transforms, and clipping

| `op` | Fields | Purpose |
|---|---|---|
| `save` / `restore` | None | Save or restore the current transform and clips |
| `translate` | `x`, `y` | Move subsequent commands |
| `rotate` | `angle`, `x`, `y` | Rotate subsequent commands around a point |
| `scale` | `scaleX`, `scaleY`, `value`, `x`, `y` | Scale subsequent commands around a point |
| `clipRect` | `x`, `y`, `width`, `height`, `radius` | Rectangular or rounded clipping |
| `clipCircle` | `x`, `y`, `radius` | Circular clipping |

Clipping affects every following command. Put `save` before a clip and `restore` after the clipped content when you need to return to the previous state.

## Fill, stroke, and effects

| Field | Example | Description |
|---|---|---|
| `fill` | `"#0A59F7"` | Fill; use `"none"` to disable |
| `stroke` | `"#FFFFFF"` | Stroke; use `"none"` to disable |
| `lineWidth` | `4` | Stroke width |
| `lineCap` | `"butt"` / `"round"` / `"square"` | Line caps |
| `lineJoin` | `"miter"` / `"round"` / `"bevel"` | Line joins |
| `miterLimit` | `10` | Miter limit |
| `dash` | `[6, 4]` | Dash pattern |
| `dashOffset` | `2` | Dash phase |
| `alpha` | `0.6` | Opacity for this command |
| `shadowColor` | `"#00000055"` | Shadow color |
| `shadowBlur` | `8` | Shadow blur |
| `shadowX` / `shadowY` | `0` / `4` | Shadow offset |
| `composite` | `"source-over"` | Blend mode |

Guaranteed blend modes: `source-over`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `destination-out`, and `copy`. Unknown values fall back to `source-over`.

## Text

Text supports fill and stroke together. Canvas draws the stroke first, then the fill:

```js
this.drawing = [
  {
    op: "text",
    text: "AWidget",
    x: 60,
    y: 60,
    size: 22,
    weight: "700",
    stroke: "#0A59F7",
    lineWidth: 2,
    fill: "#FFFFFF",
    align: "center",
    baseline: "middle",
  },
]
```

Text also supports:

- `weight`: `"normal"`, `"bold"`, `"700"`, and similar values.
- `fontStyle`: `"normal"`, `"italic"`, or `"oblique"`.
- `fontFamily`: a font family name.
- `align`: `"left"`, `"center"`, `"right"`, `"start"`, or `"end"`.
- `baseline`: `"top"`, `"middle"`, `"bottom"`, `"alphabetic"`, `"hanging"`, or `"ideographic"`.
- `maxWidth`: maximum drawing width.

Color Emoji doesn't have a regular glyph outline. It falls back to filled text and won't use the text stroke.

## Gradients and light/dark colors

Solid colors support `#RRGGBB` and `#RRGGBBAA`. You can also provide light and dark variants:

```js
const adaptiveText = {
  light: "#162033",
  dark: "#F7FAFF",
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
    { offset: 1, color: "#0A59F7" },
  ],
}
```

A radial gradient uses `type: "radial"` plus `x0`, `y0`, `r0`, `x1`, `y1`, and `r1`. Keep the start and end centers identical in the first version for consistent rendering across all supported iOS releases.

## Limits

| Item | Maximum |
|---|---:|
| Commands per Canvas | 100 |
| `polyline` points | 200 |
| `path` segments | 200 |
| Stops per gradient | 16 |
| `save` stack depth | 20 |
| `dash` items | 20 |
| Virtual coordinate width or height | 4000 |

:::tip Canvas is for data-driven graphics
Use the dedicated text, image, and icon components for fixed content. Canvas works best when a set of data determines a chart, path, or special text effect.
:::

:::warning Canvas isn't a continuous animation environment
It redraws when commands, size, or appearance changes. It doesn't run a game loop or per-frame callback, and widget refresh timing is still controlled by the system.
:::

:::warning Invalid commands are skipped
Unknown operations are skipped, invalid fields use safe defaults, and excess values are truncated. These inputs won't crash the app or widget. Drawing images inside Canvas commands isn't supported in this version.
:::
