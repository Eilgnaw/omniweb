---
sidebar_position: 1
---

# Concepts

How Omni works, in 5 minutes.

## 1. The three "places" a widget can live

iOS has different spots for widgets, and Omni supports all of them:

| Category | Type | Where it shows up |
|------|------|------------|
| Home screen | Small / Medium / Large | Home screen |
| Lock screen | Circular / Rectangular / Inline | Lock screen |
| Control Center | Button / Toggle | Control Center pull-down |
| Dynamic Island | Live Activity | Capsule area at the top of the screen |

Each type has a different size and different capabilities (for example, lock screen widgets can't use color). When you create a new widget, pick the type first.

## 2. A widget has two parts

### 1. View (what you see)

The view is built from **components**. Common ones:

- **text** `text`, **image** `image`, **SF icon** `icon`, **shape** `shape`
- **button** `button`, **date/timer** `date`, **gauge** `gauge`, **spacer** `spacer`
- **Containers**: horizontal `hstack`, vertical `vstack`, stacked `zstack`, timed-switch `tstack`, grid `grid`
- **Loop** `loop` (repeats a component N times to render array data)

See the [Components](../components/text.md) section for details.

### 2. Data (the dynamic part)

If you want your widget to show "live data" (weather, unread email, stock prices, etc.), you need to write a snippet of **JavaScript**.

```js
// Example: fetch data from an API
const req = new Request("https://2f0.cn/api/omni")
const obj = await req.fetchJSON()
this.title = obj.omni  // store the result on this.xxx so the components can use it
```

The result is bound to components via **placeholders**:

```
In the text component's "content" field, write: ${title}
```

The widget will then display the value of `obj.omni`.

:::tip Key rule
**Only variables written to `this.xxx` or declared with a top-level `let/var/const xxx` can be consumed by components.** After running the JS, Omni grabs those variables and fills them into the placeholders.
:::

:::tip Hiding internal variables
By default, every top-level `let / var / const` becomes a widget output field. If you don't want a variable exposed to components (internal constants, module-level temporaries), **prefix the name with `_`** and the extractor will skip it. Variables declared inside function bodies are automatically ignored — no need to prefix.

```js
let title = "Hello"            // → output field
const _PAGE_SIZE = 20          // _ prefix, not output
const _WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function load() {
  const now = new Date()       // function-local, auto-skipped, no _ needed
}
```
:::

## 3. Using JS

- Standard JS syntax, `async/await`, `Promise`, `Date`, `JSON` all work
- No `window`, `document`, or `fetch` (use Omni's `Request` instead)
- No npm — only Omni's built-in APIs
- The widget runtime has **limited memory (under 30MB)** — don't load huge files

## 4. When does a widget refresh?

iOS decides. Generally:

- The more often you **view** it → the system thinks you check it often → it refreshes more frequently
- Roughly **40-70 times per day** (you can't refresh on demand)
- You can "suggest": [`setUpdateFreq(30)`](../api/control.md) means "refresh again in 30 minutes" — the system **takes it as a hint**

:::warning
Don't expect instant refresh from widgets. For near-real-time scenarios, use **Live Activities** (Dynamic Island).
:::

## 5. Settings (so others can use your template)

If you built a widget and want to share it, but others need to fill in their own token, city, etc.
Omni offers "settings" — you leave a few slots empty, and after import, others fill them in via the settings panel. See [Config read/write](../api/config.md).

---

Next step: [Build your first widget →](./first-widget.md)
