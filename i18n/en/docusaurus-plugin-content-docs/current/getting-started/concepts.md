---
sidebar_position: 1
---

# Core concepts

Before you build, get familiar with widget types, layouts, data, and refresh behavior.

## 1. Choose a widget type

Each type has a different size and system location. Start with the use case:

| Location | Types | Good for |
| --- | --- | --- |
| Home Screen | Small / Medium / Large | Weather, photos, schedules, dashboards |
| Lock Screen | Circular / Rectangular / Inline | A status or number you can read at a glance |
| Control Center | Button / Toggle | Triggering an action or changing a state |
| Dynamic Island and Lock Screen | Live Activity | Ongoing progress such as sports, timers, or deliveries |

The system limits color, interaction, and refresh behavior on each surface. Lock Screen widgets, for example, usually render in a single color.

## 2. Layout defines the view; JS supplies the data

A dynamic widget has three parts:

1. **Components** such as `text`, `image`, and `icon` display content.
2. **JavaScript** fetches network or system data and stores the result in variables.
3. **Placeholders** such as `${variable}` put those variables into component properties.

Here's the complete data flow:

```js
const req = new Request("https://2f0.cn/api/omni")
const data = await req.fetchJSON()
this.title = data.omni
```

Then enter this in a text component's Content field:

```text
${title}
```

The component displays the value of `data.omni`.

:::tip Which variables can placeholders use?
The clearest approach is to put outputs on `this.xxx`. Top-level `let`, `var`, and `const` declarations are also exported. Names that start with `_` are skipped, and variables inside functions stay local.

```js
this.title = "Today's weather"  // available as ${title}
const count = 3                 // available as ${count}
const _token = "secret"         // not exported

function load() {
  const temp = 26               // local, not exported
}
```
:::

## 3. Pick the right layout component

| Layout you want | Use |
| --- | --- |
| Top to bottom | `vstack` |
| Left to right | `hstack` |
| Layers on top of each other | `zstack` |
| Mixed sizes or colors in one text run | `tstack` |
| A fixed number of columns with wrapping | `grid` |
| Repeat one layout for every array item | A container's data source |

Start with [Stack containers](../components/stack.md). For lists, continue with [Loop](../components/loop.md).

## 4. JavaScript runtime

- Standard JavaScript, `async/await`, `Promise`, `Date`, `JSON`, and `Intl` are available.
- There is no `window`, `document`, or browser `fetch`. Use Omni's [`Request`](../api/network.md) instead.
- You can't install npm packages. Use standard JavaScript and Omni's built-in APIs.
- Widget extensions have limited memory. Don't load large images, files, or full web pages at once.

## 5. iOS decides when widgets refresh

`setUpdateFreq(30)` suggests another refresh in 30 minutes, but it isn't a timer. iOS chooses the actual time based on usage, battery, and available resources.

:::warning
Don't use a regular widget for second-by-second updates. Use the [Date component](../components/date.md) for timers, or a Live Activity for ongoing status.
:::

## 6. Turn personal values into settings before sharing

If people need to enter their own city, token, color, or image, don't hard-code it. Create a setting and read it with `Setting`. See [Config and settings](../api/config.md).

---

Next: [Build your first widget →](./first-widget.md)
