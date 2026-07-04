---
sidebar_position: 99
---

# Changelog

Only **user-facing** changes are listed here. Bug fixes and internal refactors aren't on this page.

## Placeholders: new templates use `${...}`

When creating or editing templates, write placeholders as `${name}` / `${user.name}` / `${rows[row]}`.
The old `{name}` form is still compatible and is normalized to `${name}` when saved.

See [Placeholder syntax](./getting-started/placeholder.md).

---

## Settings: 3 new types + JS reverse declaration

Settings now support **number / date / image**:

```js
Setting.number("fontSize")          // → Double
new Date(Setting.date("birthday"))  // ms timestamp, plug into Date() directly
this.bg = Setting.image("bgKey")    // → "LL:{wid}/..." path
```

When picking an image, it gets **auto-compressed to match the image component's display size** in your widget, so feel free to pick large photos.

You can also **declare settings from JS**, no need to add each one by hand in the panel:

```js
Setting.add({ key: "city", name: "City", type: "text" })
Setting.add({ key: "bg",   name: "Background", type: "image" })
```

See [Config — Setting](./api/config.md#settings-setting).

---

## Settings panel UI polish

- Tap anywhere on a row to edit (no need to aim for the small pencil icon)
- Unfilled settings show a grey **"Not set"** placeholder, hinting the user to fill them in
- Long text editing now opens a dedicated **sheet** with a multi-line TextEditor instead of a cramped alert popup

---

## Placeholders: dot-path now works without a prefix

```
${user.name}     ← works directly now
${$.user.name}   ← forces global lookup, still supported
```

`${var}` is no longer just a flat variable lookup — it can now **drill into** objects and arrays.
Inside a loop, if a name collides, add the `$.` prefix to force reading from the global scope.

See [Placeholder syntax](./getting-started/placeholder.md).

---

## Loop: empty arrays no longer "disappear entirely"

Old: empty array → **the whole container wouldn't render** (layout collapsed).
New: empty array → the container is still there, it just renders 0 items.

```js
this.list = []   // no longer makes the container vanish — it just shows empty
```

See [Loop](./components/loop.md).

---

## URL triggers: JS now runs asynchronously

JS triggered via an `awidget://runjs/...` URL used to run synchronously on the main thread, which could block the UI.
It now runs on an **async thread**, so responses are smoother and it can correctly await network requests.

Cases where tapping a URL from a button / Shortcut / Live Activity left the widget **not refreshed** should be far less common now.

---

## JS variables: arrays / dictionaries now supported

```js
this.list = [1, 2, 3]            // OK
this.user = { name: "A" }        // OK
```

Previously only strings and numbers were preserved — **arrays / objects were dropped**. Now they're kept as-is and can be consumed by placeholders and loops.
Combined with the new "dot-path" and "loop" behavior above, this is very handy.

---

## URL Scheme

Every widget comes with its own URL Scheme that can be used as a callback:

```js
console.log(Widget.urlscheme)
// awidget://runjs/medium/<widget-id>
```

Opening it will **re-run this widget's JS**. Commonly used in buttons, Shortcuts, and Dynamic Island callbacks.

See [Widget info](./api/widget.md).

---

## iPad support

Omni now adapts to iPad screen sizes. The same widget can be displayed on both iPhone and iPad.

---

## Editor improvements

- **Undo / redo**: mistakes can be rolled back
- **Toolbar reorder**: common items are closer at hand
- **Property row preview**: see a component's current settings without opening the property panel
- **SF Symbols picker search**: type keywords to find icons
- **Home edit list**: supports cross-level dragging; drag / preview issues on iOS 26 fixed

---

## Small details

- **Default text scale factor changed to 0.9**: large fonts in widgets are less likely to be truncated
- **Default text line count is now unlimited**: long text wraps naturally; set it to single line yourself if needed
- **`Widget` object injection**: use `Widget.id` / `Widget.reload()` etc. directly in JS
- **Widget.reload()**: trigger a refresh of all widgets of the current type straight from JS

---

If you find a feature whose behavior doesn't match the docs, it may be a version difference. Open an issue on GitHub or reach out to the author on Weibo.
