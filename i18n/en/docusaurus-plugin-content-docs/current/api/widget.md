---
sidebar_position: 4
---

# Widget information

`Widget` is the context object for the current widget. Omni injects it automatically; you don't create it.

## Read the current widget

```js
console.log(Widget.id)
console.log(Widget.name)
console.log(Widget.type)
console.log(Widget.urlscheme)
```

| Property | Meaning |
| --- | --- |
| `id` | The widget's persistent UUID |
| `name` | The name set by the user |
| `type` | `small`, `medium`, `large`, `circular`, `rectangular`, `inline`, `button`, `toggle`, or `live` |
| `urlscheme` | A URL that runs this widget's JS again in the main app |

`Widget.urlscheme` currently returns `awidget://...`. Omni also accepts the clearer `omniwidgets://...`; both behave the same.

## Check where the code is running

`Widget.openUrl()` and `Widget.reload()` only work in the main app:

- When you tap Run in the editor.
- When `omniwidgets://runjs/...` or `Widget.urlscheme` opens Omni.

During an automatic Home Screen refresh, JS runs in the widget extension. These methods do nothing there and don't throw an error.

## Open a URL

```js
Widget.openUrl("https://2f0.cn")
Widget.openUrl("weixin://")
```

For “tap a Home Screen widget to navigate,” set [Open URL on a Stack](../components/stack.md#make-a-container-tappable). Don't put `Widget.openUrl()` in background refresh code.

## Request a timeline reload

```js
Widget.reload()
```

This asks iOS to reload every timeline for the current widget type. Use it after changing config in the main app.

:::warning `reload()` doesn't guarantee an immediate refresh
It only tells iOS that data changed. The system still decides when to read and display the new content.
:::

## Run JS from a URL

A Shortcut or another app can open:

```text
omniwidgets://runjs/medium/<widget-id>
```

You can include query parameters:

```text
omniwidgets://runjs/medium/<widget-id>?city=Shanghai&count=10
```

Read them from `$params`:

```js
const city = $params.city || "Shanghai"
Config.set("city", city)
Widget.reload()
```

## Example: sync, then open another app

```js
const request = new Request("https://api.example.com/sync")
await request.fetchJSON()
Config.set("lastSync", Date.now())
Widget.reload()
Widget.openUrl("weixin://")
```

Start this code from the editor or a run URL. Don't rely on a Home Screen background refresh for it.

## Quick reference

```js
Widget.id → string
Widget.name → string
Widget.type → string
Widget.urlscheme → string
Widget.openUrl(url) → void // main app only
Widget.reload() → void     // main app only
$params → object           // query parameters from a run URL
```
