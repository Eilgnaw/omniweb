---
sidebar_position: 13
---

# Console

Use the console to confirm which code ran, inspect API responses, and find the step where an error occurred. Logs appear in the editor's Console panel.

## Log values

```js
console.log("Loading")
console.log("Count:", 42)
console.log({ title: "Weather", values: [1, 2, 3] })
```

Multiple arguments are joined with spaces. Objects and arrays are automatically converted to JSON text.

## Log errors

```js
console.error("Loading failed")
console.error(error)
```

Error logs have an `[error]` prefix, which makes them easier to spot.

## Use it with `try...catch`

```js
try {
  const request = new Request(url)
  const data = await request.fetchJSON()
  this.value = data.value
} catch (error) {
  console.error("Request failed:", error)
  this.value = "--"
}
```

## When a placeholder is blank

Log the value you expect to display:

```js
console.log("title:", this.title)
console.log("full response:", JSON.stringify(data, null, 2))
```

If the value is `undefined`, fix the JavaScript or data path. If the value is correct, check the placeholder in the component.

## Log only in the editor

`isDebug()` returns `true` when code is running in the editor:

```js
if (isDebug()) {
  console.log("debug data:", data)
}
```

:::warning Home Screen widgets have no visible console
The console only collects logs from runs in the editor. Finish debugging there, and give your released widget a fallback for failures.
:::

## Quick reference

```js
console.log(...values)   // regular log
console.error(...values) // error log
isDebug() → boolean      // whether this run uses the editor's debug slot
```
