---
sidebar_position: 11
---

# Loop

Loop repeats one set of children for every item in an array. It isn't a separate component; it's a capability of containers such as `vstack`, `hstack`, `zstack`, and `grid`.

## Build a list in three steps

### 1. Prepare an array in JavaScript

```js
this.items = [
  { name: "Apple", price: 5 },
  { name: "Banana", price: 3 },
  { name: "Orange", price: 4 }
]
```

### 2. Set the container's Data Source

Select a `vstack` and enter:

```text
${items[item]}
```

This means “iterate over `items` and name the current item `item`.”

### 3. Use the current item in children

Put an `hstack` inside the `vstack`:

| Child | Content |
| --- | --- |
| text | `${item.name}` |
| spacer | — |
| text | `$${item.price}` |

Result:

```text
Apple       $5
Banana      $3
Orange      $4
```

## Empty arrays

```js
this.items = []
```

When the array is empty, the container still exists but creates no repeated children. You don't need an extra check.

## Nested loops

Each container level can use its own loop variable:

```js
this.groups = [
  { title: "Fruit", items: [{ name: "Apple" }, { name: "Banana" }] },
  { title: "Vegetables", items: [{ name: "Cabbage" }, { name: "Spinach" }] }
]
```

```text
Outer vstack: ${groups[group]}
├─ text: ${group.title}
└─ Inner vstack: ${group.items[item]}
   └─ text: ${item.name}
```

:::warning Don't put a loop container inside a Button
Avoid placing a `vstack`, `hstack`, `zstack`, or `grid` with a loop data source inside a Button. This nesting may fail to appear in some widgets. Keep the Button label to `text`, `icon`, `image`, or another simple layout without a loop, and place the loop container outside the Button.
:::

## Read a global value

Inside a loop, the loop variable takes priority. If it has the same name as a global value, use `$.` to force a global lookup:

```text
${item.name}  → name on the current item
${$.item}     → global this.item
```

See [Placeholder syntax](../getting-started/placeholder.md) for the full rules.

## Large arrays and performance

Loop iterates over the complete array instead of showing only the first 50 items. For example, this data can drive a 366-day progress grid for a leap year:

```js
this.days = Array.from({ length: 366 }, (_, index) => ({
  index,
  completed: index < 120
}))
```

Set the `grid` data source to `${days[day]}`, then use one shape component as its template.

:::warning
iOS gives widgets a limited memory budget. Larger arrays repeat the template more times. Keep large-grid templates simple, and avoid putting large images, complex visual effects, or another large loop inside every item.
:::

## Good use cases

- To-do and calendar lists
- Multi-day weather forecasts
- Year progress and habit-tracking grids
- Stock, RSS, or message summaries
- Icon panels or photo walls built with Grid
