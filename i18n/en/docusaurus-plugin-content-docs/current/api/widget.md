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
console.log(Widget.runsInApp)
console.log(Widget.runsInWidget)
```

| Property | Meaning |
| --- | --- |
| `id` | The widget's persistent UUID |
| `name` | The name set by the user |
| `type` | `small`, `medium`, `large`, `circular`, `rectangular`, `inline`, `button`, `toggle`, or `live` |
| `urlscheme` | A URL that runs this widget's JS again in the main app |
| `runsInApp` | Whether the script is running interactively in the main app |
| `runsInWidget` | Whether the widget extension is refreshing the widget |

`Widget.urlscheme` currently returns `awidget://...`. Omni also accepts the clearer `omniwidgets://...`; both behave the same.

## Check where the code is running

`Widget.openUrl()`, `Widget.reload()`, and `Widget.update()` only work in the main app:

- When you tap Run in the editor.
- When `omniwidgets://runjs/...` or `Widget.urlscheme` opens Omni.

During an automatic Home Screen refresh, JS runs in the widget extension. `openUrl()` and `reload()` do nothing there; `update()` returns `{ updated: false, reason: "main_app_only" }`.

Put [alerts, sharing, previews](./ui.md), and update checks inside `Widget.runInApp()`:

```js
await Widget.runInApp(async () => {
  // This callback only runs in the main app
  const alert = new Alert()
  alert.title = "Main app action"
  alert.addAction("Continue")
  alert.addCancelAction("Cancel")
  await alert.presentAlert()
})
```

The widget extension skips the callback, including any network request inside it. Calling a UI API directly in the extension is also safe: Alert returns `-1`, sharing returns `completed: false`, and QuickLook and WebView finish without presenting anything.

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

## Check for and install an update

Omni doesn't prescribe an update server. Widget authors can check their own versions, provide release notes and a `.omni` download URL, then ask the user before installing it:

```js
await Widget.runInApp(async () => {
  // This example uses mock data. You can also fetch it from your server with Request.fetchJSON().
  const release = {
    hasUpdate: true,
    version: "2.0.0",
    notes: [
      "Refine the widget design",
      "Fix data refresh issues"
    ],
    packageURL: "https://example.com/releases/widget.omni"
  }

  if (!release.hasUpdate) return

  const alert = new Alert()
  alert.title = `Version ${release.version} is available`
  alert.message = release.notes.join("\n")
  alert.addAction("Update now")
  alert.addCancelAction("Later")

  if (await alert.presentAlert() !== 0) return

  const result = await Widget.update(release.packageURL)
  console.log(result.updated, result.name, result.packageId)
})
```

`Widget.update(source)` accepts two kinds of source:

- An HTTPS download URL. Omni downloads it natively instead of copying the whole package into JavaScript memory.
- An `LD:`, `LL:`, `ID:`, or `IL:` path returned by the current widget's `FileManager`. For custom request headers, download with `fm.download(request, path)` first, then pass the local path.

Before installing, Omni checks that:

- The package uses the current versioned `.omni` format and contains `manifest.json`.
- The manifest, payload, preview, and required app build pass validation.
- The new `Widget.type` exactly matches the current widget. For example, `small` can only update to `small`.
- A protected package receives a new import grant and is decrypted successfully.
- The package is no larger than 110 MB, and downloads and redirects stay on HTTPS.

If the package or type check fails, the Promise rejects and the current widget remains unchanged. File and database replacement uses a transaction journal, so an interrupted update can recover to a consistent state.

:::warning An update replaces the widget package
Omni preserves the device's current `Widget.id`, so existing Home Screen, Lock Screen, and Control Center configurations keep pointing to the same local widget. The new package replaces the name, code, layout, setting definitions, resources, author, and permission metadata. JS Storage, `FileManager` files, and file permissions stored under the local instance ID are preserved.
:::

Each exported release still gets a new `packageId`; that doesn't prevent an in-place update. There is currently no bundle ID, update channel, or continuous author signature. The author controls version comparison, release notes, and the confirmation flow.

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
Widget.runsInApp → boolean
Widget.runsInWidget → boolean
Widget.runInApp(callback) → Promise<any>
Widget.openUrl(url) → void // main app only
Widget.reload() → void     // main app only
Widget.update(source) → Promise<{ updated, reason?, id, name, type, packageId }>
$params → object           // query parameters from a run URL
```
