---
sidebar_position: 13
---

# AWidget Markup (AWML)

:::warning Not available in the current release
Layout source editing and its MCP interfaces are disabled in the App Store build. You don't need to learn or use AWML right now. Existing widgets continue using their saved native layouts.
:::

This page remains as a technical reference for a future release. AWML uses XML-style tags to describe a native widget layout, while JavaScript continues to provide variables.

## Core structure

Every source document has one `<widget>` root. Its `type` must match the current widget type:

```xml
<widget version="1" type="medium">
  <vstack width="0" height="0" alignment="leading" spacing="8" padding="16">
    <text width="0" height="0" font-size="16">${city}</text>
    <text width="0" height="0" font-size="32" color="#FFB800">${temperature}°</text>
  </vstack>
</widget>
```

JavaScript provides variables in its separate editor:

```js
this.city = "Hangzhou"
this.temperature = 26
```

An omitted width or height defaults to 24. `0` means automatic sizing. For a full-bleed background, use a root `zstack`, a background Shape, and a separate content container.

## Editing and saving behavior

- Valid source updates the preview and is saved and exported with the widget.
- Invalid source keeps the draft and last valid preview, while visual writes and saving pause.
- Select a diagnostic to jump to the error. Fixing it resumes synchronization.
- Visual edits update the source while preserving unchanged-node formatting and comments where possible.
- Drafts remain on the current device.
- The source editor shares themes, line numbers, wrapping, undo, and redo with the JavaScript editor.

## Supported tags

`text`, `icon`, `image`, `date`, `vstack`, `hstack`, `zstack`, `tstack`, `grid`, `hgrid`, `shape`, `spacer`, `button`, `gauge`, and `canvas`.

Layout and action behavior matches the corresponding native component. A `button` still uses `value` for the code it runs.

## Basic syntax

- Close every tag and quote every attribute value.
- Empty nodes may use `<icon value="sun.max.fill" />`.
- Text tag bodies preserve spaces and line breaks. Other components use the `value` attribute.
- Escape `&` and `<` as `&amp;` and `&lt;`.
- Missing IDs are generated. Empty or duplicate IDs are errors. Don't copy an existing ID to a new node.
- HTML, CSS, DOM, `script`, DTDs, and custom entities aren't supported.

## Common attributes

| Attribute | What it does |
| --- | --- |
| `name`, `value` | Editor name and component content |
| `width`, `height` | Numeric size |
| `font-size`, `font-name` | Font size and family |
| `color`, `background` | Solid or light/dark value, such as `#FF0000` or `000000\|ffffff` |
| `padding`, `insets`, `spacing` | Overall padding, edge insets, and child spacing |
| `alignment`, `corner-radius`, `clip-shape` | Alignment, corners, and clipping |
| `opacity`, `hidden`, `rotation`, `offset-x`, `offset-y` | Visibility and transforms |
| `data-source`, `columns` | Loop source and grid column count |
| `open-url` | URL tap behavior from the native component |

Numeric size and spacing don't accept variable bindings or CSS units. `${...}` reads a variable path; it doesn't evaluate a JavaScript expression.

## Loops

```xml
<widget version="1" type="medium">
  <vstack width="0" height="0" data-source="${rows[row]}">
    <text width="0" height="0">${row.title}</text>
  </vstack>
</widget>
```

`grid` and `hgrid` accept at most one template component. Variable scope matches the visual editor. See [Loop](./loop.md).

## Complex properties

`foreground`, `background`, `shadow`, and `text-stroke` child nodes hold the existing property JSON. Canvas uses a `commands` child. CDATA avoids escaping every JSON character:

```xml
<widget version="1" type="small">
  <text width="0" height="0" font-size="24">${title}
    <foreground><![CDATA[{"1":"FF0000|0000FF","4":"lgradient","2":"topLeading","3":"bottomTrailing"}]]></foreground>
    <shadow><![CDATA[{"2":4,"3":0,"4":2}]]></shadow>
  </text>
</widget>
```

Don't specify one property as both a shorthand attribute and a child node. Canvas `commands` may contain a command array or a JSON string that binds an entire array, such as `"${drawing}"`.

## Live Activities and control widgets

Live Activities declare regions with `<region name="...">`. Names are `lockWidget`, `expandBottom`, `expandCenter`, `expandLead`, `expandTrail`, `compactLead`, `compactTrail`, `minimal`, and `watch`.

```xml
<widget version="1" type="live">
  <region name="lockWidget"><text width="0" height="0">${status}</text></region>
  <region name="minimal"><icon value="timer" /></region>
</widget>
```

Omitted regions use an empty layout, and regions can't be duplicated. Push still updates variables only; AWML doesn't cause remote pushes to run JavaScript.

A control widget uses `control-toggle` with `title`, `image`, `state`, `color`, `url`, and `code`:

```xml
<widget version="1" type="toggle">
  <control-toggle title="Lights" image="lightbulb.fill" state="${state}" code="${code}" />
</widget>
```

## AI and MCP workflow

When the feature is available again, use this order:

1. `get_markup_schema`: read the syntax and complete attribute list.
2. `get_guide`: look up component and JavaScript API guidance.
3. `validate_markup`: validate `markup` and an optional `type`, then fix diagnostics.
4. `create_widget`: pass a name, type, `markup`, and optional `jscode`.
5. Before editing, call `get_widget`, then pass its `revision` to `update_widget` as `expectedRevision`.

`markup` is mutually exclusive with the older `layout/text` arguments. Validation doesn't save a widget or execute JavaScript.

## Limits

- Source size: 1 MiB.
- Nodes: 10,000.
- Nesting depth: 64.
- Unsupported source versions are preserved and can't be rewritten.
