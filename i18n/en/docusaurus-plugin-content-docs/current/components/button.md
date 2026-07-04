---
sidebar_position: 5
---

# Button

A tappable component that **runs a piece of JS** when tapped.

:::warning Can't open URLs
**Button can only run JS — it can't open URLs directly** (it's built on AppIntent, a system limitation).
For "tap to navigate", use a [stack container](./stack.md) as a button — vstack / hstack / zstack / tstack / grid all have an "Open URL" property, and the entire container becomes tappable.
:::

:::warning Platform limits
Buttons on home screen widgets require **iOS 17+**. Lock screen widgets and Dynamic Island widgets currently can't host tappable buttons (system limitation).
:::

## Usage

Tap the ➕ in the top-right of the editor and add **button**. You can place any children inside it (text / icon / image) to define its appearance. Then in the button's properties, write the JS to run.

## Common properties

| Property | Description |
|----------|-------------|
| Children | The button's visuals (text, icon, etc.) |
| Content (JS code) | The JS snippet run on tap |
| Style | plain (no border) / noflash (no flash) / normal (system button) |
| Background / Corner radius | Visual tweaks |

## Button code vs. main JS

| | Main JS | Button code |
|---|---------|-------------|
| When it runs | When the widget **refreshes** | When the user **taps** the button |
| Used for | Fetching data / API calls, assigning to `this.xxx` | Changing local state / triggering actions |
| Length | Usually longer | Usually a few lines |

After the button code runs, Omni automatically refreshes the widget so the new state takes effect.

## Example: toggle a "liked" state

Main JS:
```js
this.state = getValue("liked") || "heart"
```

Button code:
```js
const cur = getValue("liked") || "heart"
setValue("liked", cur === "heart" ? "heart.fill" : "heart")
```

Inside the button, place an icon with content `${state}` — each tap toggles between "♡" and "❤".

## Want "tap to open a URL"?

Don't use a button — use a stack container instead:

```
zstack (Open URL: https://2f0.cn)
  └─ text  ("Open site")
```

Or open a third-party app:

```
hstack (Open URL: weixin://)
  ├─ icon  (message.fill)
  └─ text  ("Open WeChat")
```

More in [stack.md → Open URL](./stack.md#openurl).
