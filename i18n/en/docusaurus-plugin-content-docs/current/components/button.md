---
sidebar_position: 5
---

# Button

Button runs a short piece of JavaScript after the user taps it. Use it to change state, record an action, or trigger an App Intent.

## Pick the right kind of tap

| Goal | Use |
| --- | --- |
| Run JavaScript after a tap | **Button** |
| Open a website or app after a tap | A [Stack](./stack.md#make-a-container-tappable) with Open URL |

:::warning Button can't open a URL directly
Button is built on App Intent and only runs code. To navigate, make a `vstack`, `hstack`, `zstack`, `tstack`, or `grid` tappable.
:::

:::warning System limits
Button in a Home Screen widget requires iOS 17 or later. Lock Screen widgets and Live Activities can't contain this kind of tappable Button.
:::

## Quick start

1. Add **button**.
2. Put `text`, `icon`, or `image` inside it to define its appearance.
3. Enter the JavaScript to run in the Button's Content field.

After the code finishes, Omni asks the system to refresh the widget so the new state can appear.

## Main JS vs. Button code

| | Main JS | Button code |
| --- | --- | --- |
| Runs | When the widget refreshes | When the user taps |
| Best for | Fetching data and assigning `this.xxx` | Changing state or triggering an action |
| Suggested length | May contain the full data flow | Keep it short, usually a few lines |

## Example: toggle a favorite

Main JS reads the state:

```js
this.icon = getValue("favorite") || "heart"
```

Button Content toggles it:

```js
const current = getValue("favorite") || "heart"
setValue("favorite", current === "heart" ? "heart.fill" : "heart")
```

Add an Icon inside the Button and set its Content to `${icon}`. Each tap switches between an outline and filled heart.

## Common properties

| Property | What it does |
| --- | --- |
| Children | The text, symbol, or image shown by the Button |
| Content | JavaScript to run after a tap |
| Style | `plain` has no border; `noflash` doesn't flash; `normal` uses the system style |
| Background / Corner radius | Changes the Button's appearance |
