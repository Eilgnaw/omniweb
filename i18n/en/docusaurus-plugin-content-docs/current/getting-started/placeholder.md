---
sidebar_position: 3
---

# Placeholder syntax

Placeholders are the bridge that **feeds JS data into components**. The syntax is dead simple: wrap a variable name or path in `{...}`.

## Basics: `{variableName}`

In JS:

```js
this.title = "Hello"
this.count = 42
```

In a component's content field:

```
{title}      → shows: Hello
You have {count} new messages  → shows: You have 42 new messages
```

## Going further: `{object.field}` dot-path

If your variable is an object or array, you can drill in with dot / bracket notation:

```js
this.user = {
  name: "Alice",
  badges: ["VIP", "Newbie"]
}
```

```
{user.name}        → Alice
{user.badges[0]}   → VIP
```

Any level of nesting works: `{a.b[0].c.d}` resolves fine.

:::info This is a new feature
Older versions required `{$.user.name}`; with this update, **dot-paths now work without a prefix**.
:::

## Force global: `{$.xxx}`

The `$.` prefix means "**bypass the loop scope and look in the outermost global scope**".
You won't usually need this — only when writing a loop where a **variable inside the loop** collides with a **global variable name** outside.

```js
this.row = "outer"
this.list = [{ name: "A" }, { name: "B" }]
```

```
Inside the loop:
  {row}     → current loop item, e.g. {name:"A"}
  {$.row}   → "outer"   ← force read from global
```

## Loop data source: `{array[variableName]}`

This form is only used in the "loop data source" field of containers like **loop / vstack / hstack**.
It means: **iterate over an array, naming each item with a given variable**, so child components can use that variable.

```js
this.rows = [
  { title: "Apple", price: 5 },
  { title: "Banana", price: 3 }
]
```

In the container's loop data source field:

```
{rows[row]}
```

This means — iterate over `rows`, calling each item `row`. Child components can then write:

```
{row.title}    → Apple / Banana
{row.price}    → 5 / 3
```

Nested loops are supported too:

```
Outer data source: {rows[row]}
Inner data source: {row.cells[cell]}    ← use the `cells` field of the outer `row`
Inner component:   {cell.text}
```

See [Loop component](../components/loop.md) for details.

## What happens when a value can't be found?

- Placeholder **doesn't exist** → replaced with an empty string `""`, no error
- You **wrote the wrong path** → same thing, shows blank (so use `console.log` to check)

## Cheat sheet

| Syntax | Meaning |
|------|------|
| `{name}` | Read `this.name` |
| `{user.name}` | Read `this.user.name` |
| `{list[0]}` | Read `this.list[0]` |
| `{a.b[2].c}` | Any level of nesting |
| `{$.name}` | Force global, skip loop scope |
| `{rows[row]}` | Loop: used in the "loop data source" field |
| text `{x}` text | Multiple placeholders can mix inside one string |
