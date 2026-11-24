---
sidebar_position: 5
---

# Main app interfaces

Omni can present system alerts, share sheets, file previews, and web pages from JavaScript. They only appear when the script runs from the editor or when `Widget.urlscheme` opens the main app.

Put the whole interaction inside `Widget.runInApp()` so the widget extension won't perform unnecessary network requests during a refresh:

```js
await Widget.runInApp(async () => {
  const alert = new Alert()
  alert.title = "Main app interaction"
  alert.addAction("Continue")
  alert.addCancelAction("Cancel")
  await alert.presentAlert()
})
```

## Alert

```js
const alert = new Alert()
alert.title = "Update available"
alert.message = "This release fixes data refresh issues."
alert.addAction("Update now")
alert.addDestructiveAction("Clear cache and update")
alert.addCancelAction("Later")

const index = await alert.presentAlert()
```

Regular and destructive actions are numbered from `0` in the order they were added. Cancel always returns `-1`. `present()` is shorthand for `presentAlert()`, while `presentSheet()` uses an action sheet.

Alerts can also collect text input:

```js
const alert = new Alert()
alert.title = "Connect to server"
alert.addTextField("Address", "https://example.com")
alert.addSecureTextField("Token")
alert.addAction("Continue")
alert.addCancelAction("Cancel")

if (await alert.presentAlert() === 0) {
  const server = alert.textFieldValue(0)
  const token = alert.textFieldValue(1)
}
```

:::warning Action sheets don't support text fields
After adding a text field, use `presentAlert()` instead of `presentSheet()`.
:::

## ShareSheet

```js
const fm = FileManager.local()
const report = fm.documents() + "report.txt"
fm.writeString(report, "Hello, Omni!")

const result = await ShareSheet.present([
  "Share notes",
  "https://example.com",
  report
])
console.log(result.completed, result.activityType)
```

The array can contain plain text, HTTPS URLs, and `FileManager` paths owned by the current widget. Omni won't read another widget's paths, absolute paths, or paths that escape the widget directory.

## QuickLook

```js
const fm = FileManager.local()
const file = fm.documents() + "manual.pdf"
await QuickLook.present(file)
```

`QuickLook.present()` accepts a virtual file path owned by the current widget or an HTTPS URL. The script resumes after the preview closes. Remote previews are limited to 110 MB.

## WebView

Present an HTTPS page:

```js
await WebView.present("https://example.com/release-notes")
```

Present an HTML string:

```js
await WebView.presentHTML(`
  <meta name="viewport" content="width=device-width">
  <h1>Release notes</h1>
  <p>Thanks for using the widget.</p>
`)
```

WebView uses temporary website data, doesn't inject Omni native APIs into the page, and blocks insecure navigation such as HTTP.

## Calling these APIs in the widget extension

Even without `Widget.runInApp()`, these APIs won't make a widget refresh fail:

| API | Result in the widget extension |
| --- | --- |
| `Alert.presentAlert()` / `presentSheet()` | Returns `-1` |
| `ShareSheet.present()` | Returns `{ completed: false, reason: "main_app_only" }` |
| `QuickLook.present()` / `WebView.present()` | Presents nothing and fulfills the Promise |
| `Widget.update()` | Returns `{ updated: false, reason: "main_app_only" }` |

This fallback only keeps the refresh safe. If an update check performs a network request first, use `Widget.runInApp()` or the widget extension will repeat that request on every refresh.

:::warning Await UI Promises
These APIs complete after the user closes the interface. Use `await` so the script continues in the expected order.
:::

## Quick reference

```js
new Alert() → Alert
alert.addAction(title) → void
alert.addDestructiveAction(title) → void
alert.addCancelAction(title) → void
alert.addTextField(placeholder?, text?) → void
alert.addSecureTextField(placeholder?, text?) → void
alert.textFieldValue(index) → string | null
alert.present() → Promise<number>
alert.presentAlert() → Promise<number>
alert.presentSheet() → Promise<number>
ShareSheet.present(items) → Promise<{ completed, activityType?, reason? }>
QuickLook.present(source) → Promise<void>
WebView.present(url) → Promise<void>
WebView.presentHTML(html, baseURL?) → Promise<void>
```
