---
sidebar_position: 11
---

# Loop

Render a component **N times over an array**. Under the hood, you give a container (vstack / hstack / zstack / grid) a **loop data source**.

:::tip
Loop isn't its own component — it's a capability any container can opt into via its properties.
:::

## Step 1: prepare an array in JS

```js
this.list = [
  { name: "Apple",  price: 5 },
  { name: "Banana", price: 3 },
  { name: "Orange", price: 4 }
]
```

## Step 2: turn on looping for a container

Select the container (e.g. vstack), find **Data source** (dataSource) in its properties, and enter:

```
${list[item]}
```

Meaning: iterate `list`, name each entry `item`, and children can then access `item.xxx`.

## Step 3: children use the loop variable

Put an hstack inside, containing:

| Child | Content |
|-------|---------|
| text | `${item.name}` |
| spacer | — |
| text | `¥${item.price}` |

Result:

```
Apple      ¥5
Banana     ¥3
Orange     ¥4
```

## Nested loops

Containers can nest, and each level loops independently.

```js
this.tables = [
  { title: "Fruit",      items: [{n:"Apple"},{n:"Banana"}] },
  { title: "Vegetables", items: [{n:"Cabbage"},{n:"Spinach"}] }
]
```

Outer vstack:
- Data source `${tables[t]}`
- Inside:
  - text  content `${t.title}`
  - vstack (data source `${t.items[it]}`)
    - text content `${it.n}`

## Empty array behavior

If the array is **empty**, the loop renders no children (blank).

```js
this.list = []   // safe, no error — the container is just empty
```

:::info This is new behavior
Older versions would **hide the entire container** for an empty array, which could break layouts.
Now an empty array just means "loops 0 times" — the container itself still exists.
:::

## Global escape: `${$.xxx}`

Inside a loop, if you want to read an outer global variable but the loop variable has the same name, use the `$.` prefix to force a global lookup:

```js
this.row = "outer"            // global
this.list = [{ row: "inner" }]
```

Container data source `${list[row]}`, then inside a text:
- `${row}`     → inner (loop variable wins)
- `${$.row}`   → outer (forced global)

Full rules in [Placeholder syntax](../getting-started/placeholder.md).

## Common use cases

- **Task / to-do lists** (one item per row)
- **Multi-day weather forecasts** (7 items → 7 forecast cells)
- **Stock tickers**, **inbox previews**, **RSS headlines**
- **Photo walls** (grid + loop)
