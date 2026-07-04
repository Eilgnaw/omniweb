---
sidebar_position: 2
---

# Build your first widget

Follow this section and you'll end up with a **medium-sized widget that shows the current weather**.

## 1. Create a new widget

Open Omni → tap `+` in the top-right of the home screen → pick **Medium** → give it a name → enter the editor.

## 2. Build a simple layout

From the editor's top-right `+`, add these in order:

- A **vstack** (vertical container) as the root
- Inside the vstack, add an **icon** (SF Symbol)
- Then add a **text** (condition)
- Then another **text** (temperature)

The layout looks roughly like:

```
┌─────────────┐
│   ☀ icon    │
│ Sunny (text)│
│  26° (text) │
└─────────────┘
```

## 3. Write the JS

Tap the **`<>` (code)** button at the bottom of the editor and paste:

```js
try {
    const result = await Weather.getCurrent()
    const obj = JSON.parse(result)

    this.icon = obj.symbolName                       // SF Symbol name, e.g. "sun.max"
    this.text = obj.condition                        // condition, e.g. "mostlyCloudy"
    this.temp = Math.trunc(obj.temperature.value)    // temperature, truncated
} catch (error) {
    this.icon = "exclamationmark.triangle.fill"
    this.text = "Error"
    this.temp = "--"
    console.log(error)
}
```

Tap **Run**. If the console shows no errors, `this.icon` / `this.text` / `this.temp` are all set.

## 4. Bind JS data to components

Back on the canvas, tap each component and fill in its "content" field:

| Component | Content field |
|------|-----------|
| icon | `${icon}` |
| first text | `${text}` |
| second text | `${temp}°` |

`${xxx}` is a placeholder — Omni automatically replaces it with the value of `this.xxx` from your JS.

:::tip More placeholder forms
- `${obj.name}` — read a field on an object directly
- `${$.xxx}` — force read from the global scope
- `${rows[row]}` — for loops

See [Placeholder syntax](./placeholder.md).
:::

## 5. Control the refresh rate

Weather doesn't need to refresh every minute. Add this at the end of your JS:

```js
setUpdateFreq(30) // suggest the system refresh again in 30 minutes
```

> This is only a "suggestion" — iOS ultimately decides when the actual refresh happens. See [Widget control](../api/control.md).

## 6. Save → add to home screen

- Tap **Save** in the top-right of the editor.
- Leave the app, long-press the home screen → add widget → find **Omni Medium** (or the matching type) → add.
- Long-press the widget you just added → **Edit Widget** → pick the one you just built.

Done!

---

Recommended next reads:

- [Placeholder syntax](./placeholder.md) — feed complex data into components
- [Loop](../components/loop.md) — render lists / arrays
- [API docs](../api/network.md) — see what else you can call
