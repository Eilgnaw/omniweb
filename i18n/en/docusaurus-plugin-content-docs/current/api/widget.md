---
sidebar_position: 4
---

# Widget Info

`Widget` is an **auto-injected** object that represents the currently running widget. Use it to get the widget's ID, type, and name, and — when running in the **main app context** — to trigger navigation or refreshes.

## Properties

```js
console.log(Widget.id)         // "ABCD-1234-EF56-..."  the widget's unique UUID
console.log(Widget.name)       // "My Weather Widget"   the widget's name
console.log(Widget.type)       // "small" | "medium" | "large" | "circular" | ...
console.log(Widget.urlscheme)  // "awidget://runjs/medium/ABCD..."  auto-generated callback URL
```

| Property | Meaning |
|------|------|
| `id` | The widget's UUID — persistent identifier |
| `name` | The name the user gave it |
| `type` | The widget's type string (small / medium / large / circular / rectangular / inline / button / toggle / live) |
| `urlscheme` | A fixed URL — opening it **re-runs the widget's JS**; useful for button / shortcut callbacks |

## ⚠️ About the Runtime Environment

The `openUrl` / `reload` methods below **only work in the main app context**.
That means they only take effect in two scenarios:

1. **In the editor**: when you're editing a widget and hit "Run" — the JS runs in the main app
2. **Via `Widget.urlscheme`**: someone opens `awidget://runjs/...` (from a shortcut, button, or another app), iOS launches Omni, and the JS runs in the main app

When the widget refreshes **on its own on the home screen**, the JS runs inside the widget extension (a separate sandbox) — these two methods become **no-ops**. They don't throw and don't do anything.

## Widget.openUrl(url)

Opens the specified URL (https, scheme, etc.).

```js
Widget.openUrl("https://2f0.cn")
Widget.openUrl("weixin://")
Widget.openUrl(Widget.urlscheme)   // equivalent to "re-run myself"
```

**Only works in the two scenarios above.** If you want "user taps the widget on the home screen → open a URL", **don't** rely on `Widget.openUrl` — use the [stack container's "Open URL" property](../components/stack.md#openurl) instead.

## Widget.reload()

Asks the system to **refresh all timelines for this widget type**.

```js
Widget.reload()
```

Typical use: the user changed config or data in the main app, and you want the home screen to sync immediately.
**Also only works in the main app context** (no-op when running in the widget extension on the home screen).

:::info
"Reload" doesn't mean "redraw immediately" — it just tells iOS "my data has updated, you can come fetch it". iOS still decides when to actually pull.
:::

## Example: Launch via Shortcut, Run JS, Then Jump to a Third-Party App

In the Shortcuts "Open URL" action, fill in:

```
awidget://runjs/medium/<widget id>
```

This launches the Omni main app and runs the widget's JS. In the JS, you can finish your work and then jump elsewhere:

```js
const data = await new Request("https://api.example.com/sync").fetchJSON()
setConfig("lastSync", String(Date.now()))
Widget.openUrl("weixin://")    // after syncing, open WeChat
```

The `runjs` URL can also **carry query parameters** through to the JS, e.g.:
```
awidget://runjs/medium/<widget id>?city=Shanghai&count=10
```
Then in JS, read them via `$params` (e.g. `$params.city`).

## Example: Update Config in the Main App, Trigger a Home Screen Refresh

```js
setConfig("city", "Shanghai")
Widget.reload()  // tell the system: all instances of this widget type should update
```
