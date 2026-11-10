---
sidebar_position: 2
---

# Build your first widget

This tutorial builds a medium widget that shows the current weather. It takes about 10 minutes.

When you're done, it will show:

- The current weather icon
- The current condition
- The current temperature

## 1. Create a medium widget

Open Omni, tap `+` in the top-right of the home screen, choose **Medium**, name the widget, and open the editor.

:::tip The editor adapts to the window
Omni requires iOS 17 or later. In a wide window, the preview stays on the left and components and properties appear on the right; drag the divider to resize the columns, or double-tap it to restore the system ratio. In a narrow window, the editor panel sits below the preview; drag its top handle, or reopen it with the edit button after hiding it. Resizing the panel doesn't move the preview. Drag the preview with one finger, pinch to zoom, or double-tap to reset it. Code appears in the right column on wide screens and in a large sheet on narrow screens. Rotating the device or resizing Split View preserves your current page, source, and undo history.
:::

## 2. Add three components

Tap `+` in the editor and add, in order:

1. A `vstack` as the vertical container.
2. An `icon` inside the `vstack` for the weather symbol.
3. Two `text` components for the condition and temperature.

Your component tree should look like this:

```text
vstack
├─ icon
├─ text
└─ text
```

Don't style it yet. Once the structure matches, continue.

## 3. Fetch the weather

Tap the code button, open the JavaScript editor, and paste:

```js
try {
  const weather = await Weather.current()

  this.icon = weather.symbolName
  this.condition = weather.condition
  this.temperature = Math.trunc(weather.temperature.value)
} catch (error) {
  this.icon = "exclamationmark.triangle.fill"
  this.condition = "Weather unavailable"
  this.temperature = "--"
  console.error(error)
}
```

Tap **Run**. If the console shows no error, your data is ready.

:::tip The first run asks for permission
Weather needs your location. Allow location access when iOS prompts you, or the Weather API will fail.
:::

### Edit in VS Code (optional)

When you need desktop editing, tap the computer button in the JavaScript editor to start sync. Closing the code editor disconnects it; reopening the editor doesn't reconnect automatically.

## 4. Put the data into components

Return to the component editor and set each Content field:

| Component | Content |
| --- | --- |
| icon | `${icon}` |
| first text | `${condition}` |
| second text | `${temperature}°` |

`${temperature}` is replaced with `this.temperature` from your JavaScript. The preview should now show the current weather.

If a field is blank, run the code again and check the console. See [Placeholder syntax](./placeholder.md) for more forms.

## 5. Suggest the next refresh

Add this at the end of your JavaScript:

```js
setUpdateFreq(30) // suggest another refresh in 30 minutes
```

This is only a hint to iOS, not a precise 30-minute timer. See [Widget control](../api/control.md).

## 6. Save and add it to the Home Screen

1. Tap **Save** in the top-right of the editor.
2. Return to the Home Screen, long-press an empty area, and add an **Omni Medium** widget.
3. Long-press the new widget and tap **Edit Widget**.
4. Choose the widget you just saved.

You're done. Now adjust the fonts, colors, spacing, and background to make it yours.

## What to read next

- [Placeholder syntax](./placeholder.md): display object fields and array data.
- [Stack containers](../components/stack.md): learn the core layouts.
- [Loop](../components/loop.md): render several records with one layout.
- [JavaScript APIs](../api/network.md): use the network and more system data.
