---
sidebar_position: 13
---

# Tag layouts (AWidget Markup)

AWidget Markup (AWML) describes widgets using XML-style native component tags. Layout source is saved separately from JavaScript, which continues to supply variables. Tags compile to existing native layouts. Home Screen, Lock Screen, control widgets and Live Activities are supported.

## Getting started

In the full editor, open the code editor menu and choose Layout source. It opens a large sheet like the JavaScript editor. Existing layouts are converted to tags. Valid source changes update the preview; close the source sheet to return to the component list. Visual changes update the corresponding source while retaining unchanged nodes, formatting and comments.

```xml
<widget version="1" type="medium">
  <vstack width="0" height="0" alignment="leading" spacing="8" padding="16">
    <text width="0" height="0" font-size="16">${city}</text>
    <text width="0" height="0" font-size="32" color="#FFB800">${temperature}°</text>
  </vstack>
</widget>
```

Supply data in the separate JavaScript editor:

```js
this.city = "Hangzhou";
this.temperature = 26;
```

Dimensions follow existing component behavior: omitted width and height default to 24; `0` means automatic sizing. For full-bleed backgrounds, use a root `zstack`, a background shape and a separate content container; see the existing component documentation.

Invalid input keeps the draft and last valid preview, and pauses visual writes and saving. Select a diagnostic to jump to its line. Fixing the error resumes synchronization. Source mode reuses the existing code editor, including its themes, line numbers, wrapping, and keyboard accessory. The top-right more menu opens editor settings and inserts tags or attributes; the checkmark saves the layout. Layout undo/redo in the code editor menu and the source more menu restores source and visual edits. Drafts remain on the current device; valid source is saved and exported with the widget.

## Tags and attributes

Supported tags: `text`, `icon`, `image`, `date`, `vstack`, `hstack`, `zstack`, `tstack`, `grid`, `hgrid`, `shape`, `spacer`, `button`, `gauge`, and `canvas`. Layout and action behavior follows existing native components. A `button` value still contains the code executed by that button.

- Close every tag and quote attribute values. Empty nodes can use `<icon value="sun.max.fill" />`.
- Use a `<widget version="1" type="medium">` root. The type must match the widget being edited.
- `text` bodies preserve spaces and newlines. Other components use the `value` attribute. Escape `&` and `<` as `&amp;` and `&lt;`.
- Missing IDs are generated and written back. Empty or duplicate IDs are errors. Keep existing IDs when editing; do not reuse an ID when adding a node.
- Generic HTML, CSS, DOM, script blocks, DTDs and custom entities are unsupported.

| Common attributes | Meaning |
| --- | --- |
| `name`, `value` | Editor name and component content |
| `width`, `height` | Numeric dimensions |
| `font-size`, `font-name` | Font size and font |
| `color`, `background` | Single or existing light/dark colors, such as `#FF0000` or `000000\|ffffff` |
| `padding`, `insets`, `spacing` | Overall padding, edge insets and child spacing |
| `alignment`, `corner-radius`, `clip-shape` | Alignment, corners and clipping |
| `opacity`, `hidden`, `rotation`, `offset-x`, `offset-y` | Dynamic visibility and transforms |
| `data-source`, `columns` | Loop source and grid columns |
| `open-url` | Existing component URL behavior |

Get the complete attribute list through MCP `get_markup_schema`. Attributes only affect native components that use them. Numeric dimensions and spacing do not accept bindings or CSS units. `${…}` uses existing path bindings and does not evaluate JavaScript expressions.

```xml
<widget version="1" type="medium">
  <vstack width="0" height="0" data-source="${rows[row]}">
    <text width="0" height="0">${row.title}</text>
  </vstack>
</widget>
```

`grid` and `hgrid` accept at most one template component. See [Loop](./loop.md) for iteration and variable scopes.

## Complex properties

Use `foreground`, `background`, `shadow`, and `text-stroke` child nodes containing existing property JSON. Canvas uses a `commands` child containing existing command JSON: either a command array or a JSON string binding the entire array, such as `"${drawing}"`. CDATA avoids escaping individual JSON characters.

```xml
<widget version="1" type="small">
  <text width="0" height="0" font-size="24">${title}<foreground><![CDATA[{"1":"FF0000|0000FF","4":"lgradient","2":"topLeading","3":"bottomTrailing"}]]></foreground><shadow><![CDATA[{"2":4,"3":0,"4":2}]]></shadow></text>
</widget>
```

Color objects use `1` for the color value, `2/3` for start/end directions, `4` for `single/lgradient/rgradient/agradient`, and `5` for the center. Shadow objects use `1` for a color object, `2` for radius, and `3/4` for X/Y offsets. Text stroke objects use `1` for a color object and `2` for width. Do not specify the same property as both a shorthand attribute and a child node.

## Live Activities and control widgets

Live Activities use `<region name="…">`. Region names are `lockWidget`, `expandBottom`, `expandCenter`, `expandLead`, `expandTrail`, `compactLead`, `compactTrail`, `minimal`, and `watch`. Omitted regions have empty layouts; duplicate regions are invalid.

```xml
<widget version="1" type="live">
  <region name="lockWidget"><text width="0" height="0">${status}</text></region>
  <region name="minimal"><icon value="timer" /></region>
</widget>
```

Push updates still supply data through existing variables. Tags do not cause remote pushes to execute JavaScript.

A control widget contains one dedicated node with `title`, `image`, `state`, `color`, `url`, and `code` attributes. Supplied fields override matching JavaScript output; omitted fields retain the existing output. Actions and system presentation follow existing control widgets.

```xml
<widget version="1" type="toggle">
  <control-toggle title="Lights" image="lightbulb.fill" state="${state}" code="${code}" />
</widget>
```

Visual mode provides control fields synchronized with source.

## AI and MCP

1. Call `get_markup_schema` for syntax, and `get_guide` for component and JavaScript API details.
2. Call `validate_markup` with `markup` and an optional `type`, then fix returned diagnostics.
3. Call `create_widget` with name, type, `markup`, and optional `jscode`. `markup` is mutually exclusive with `layout/text`.
4. Before editing, call `get_widget` for `markup` and `revision`. Pass `expectedRevision` to `update_widget` to avoid overwriting concurrent changes.

Validation neither saves widgets nor executes JavaScript. Valid normalized source includes generated IDs. Limits are 1 MiB, 10,000 nodes and 64 nesting levels. Existing JSON interfaces remain supported. Unsupported source versions are preserved and cannot be rewritten.
