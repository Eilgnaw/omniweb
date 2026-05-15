---
sidebar_position: 13
---

# Console

For debugging. All `console.log` output shows up in the "Console" panel at the bottom of the editor.

## Basics

```js
console.log("hello")
console.log("count:", 42)
console.log({ a: 1, b: [1, 2, 3] })  // objects/arrays are auto-stringified to JSON
```

## Multiple Arguments

Multiple arguments are supported and joined by spaces:

```js
console.log("name:", name, "age:", age)
// name: Alice age: 18
```

## Error Logs

```js
console.error("something went wrong")
console.error(err)
```

Works the same as `console.log`, but the log line gets an `[error]` prefix so you can filter on it.

## Pairing with try / catch

It's a good habit to wrap async APIs:

```js
try {
  const data = await new Request(url).fetchJSON()
  this.value = data.value
} catch (e) {
  console.error("data fetch failed:", e)
  this.value = "--"
}
```

## Debugging Tips

- The console only shows output **when running in the editor**. There's no console when the widget runs on the home screen.
- To see exactly what a variable holds, just `console.log(JSON.stringify(obj, null, 2))`.
- Troubleshooting a placeholder that won't show? First `console.log` to check if it's `undefined`.
- The global `isDebug()` function returns whether you're currently debugging in the editor — useful as a "only log when debugging" switch.

```js
if (isDebug()) {
  console.log("debug info:", obj)
}
```
