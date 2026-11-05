---
sidebar_position: 8
---

# Spacer

Spacer fills the remaining room in a container and pushes the components before and after it apart.

## Quick start

Add **spacer** inside an `hstack` or `vstack`. It usually needs no properties.

## Example: align to both sides

```text
hstack
├─ text
├─ spacer
└─ icon
```

Text stays on the left, Icon stays on the right, and Spacer fills the middle.

## Example: align to top and bottom

```text
vstack
├─ text (title)
├─ spacer
└─ text (caption)
```

The title stays at the top and the caption at the bottom.

:::tip Multiple spacers
Several Spacers in the same container share the remaining room. For a fixed distance, use container spacing or padding instead.
:::
