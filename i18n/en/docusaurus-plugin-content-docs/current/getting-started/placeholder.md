---
sidebar_position: 3
---

# Placeholder syntax

Placeholders put JavaScript results into component properties. Most of the time, you only need one form:

```text
${variableName}
```

:::tip Existing templates still work
The old `{variableName}` form is converted to `${variableName}` when you save. Use `${...}` in new templates.
:::

## Display a variable

JavaScript:

```js
this.title = "Today's weather"
this.temperature = 26
```

Component content:

```text
${title}
Currently ${temperature}°
```

One string can contain fixed text and multiple placeholders.

## Read a value from an object or array

```js
this.user = {
  name: "Alice",
  badges: ["VIP", "New"]
}
```

```text
${user.name}       → Alice
${user.badges[0]}  → VIP
```

You can keep nesting dot paths and array indexes, as in `${forecast[0].temperature.value}`.

## Loop over an array in a container

A loop data source uses a different form from a normal placeholder:

```js
this.rows = [
  { name: "Apple", price: 5 },
  { name: "Banana", price: 3 }
]
```

Enter this in the container's Data Source field:

```text
${rows[row]}
```

This means “iterate over `rows` and name the current item `row`.” Child components can use:

```text
${row.name}
USD ${row.price}
```

Nested loops can continue from the outer item:

```text
Outer data source: ${rows[row]}
Inner data source: ${row.cells[cell]}
Inner component: ${cell.text}
```

See [Loop](../components/loop.md) for a complete example.

## When should you use `${$.name}`?

`$.` means “ignore the current loop variable and read from the outermost scope.” You only need it when a loop variable and global variable have the same name.

```js
this.row = "Global value"
this.rows = [{ name: "First item" }]
```

Inside a `${rows[row]}` loop:

```text
${row.name}  → First item
${$.row}     → Global value
```

## What if the content is blank?

If Omni can't find a variable or path, it displays an empty string without throwing an error. Check in this order:

1. Run the JavaScript again.
2. Use `console.log` to confirm the value isn't `undefined`.
3. Check capitalization, dots, and array indexes.
4. Make sure a normal component isn't using loop data-source syntax.

## Quick reference

| Syntax | Use |
| --- | --- |
| `${name}` | Read `this.name` |
| `Hello, ${name}` | Insert a variable into text |
| `${user.name}` | Read an object field |
| `${list[0]}` | Read an array item |
| `${a.b[2].c}` | Read a nested path |
| `${rows[row]}` | Iterate over an array in a container's Data Source field |
| `${row.name}` | Read the current item inside a loop |
| `${$.name}` | Force a global lookup from inside a loop |
