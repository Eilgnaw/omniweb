---
sidebar_position: 8
---

# Spacer

A flexible placeholder that **pushes apart** the elements before and after it in the same container. Think of it as "whitespace that auto-expands".

## Usage

Tap the ➕ in the top-right of the editor and add **spacer**. You usually don't need any properties.

## Example: text on the left, icon on the right

Inside an **hstack**:

```
[ text ] [ spacer ] [ icon ]
```

Result: text sticks to the left, icon to the right, spacer fills the middle.

## Example: push content to top and bottom

Inside a **vstack**:

```
[ text title ]
[ spacer ]
[ text subtitle ]
```

Result: title pinned to the top, subtitle pinned to the bottom.

:::tip
- Without a spacer, container children default to **center**-aligned (or whatever "alignment" is set to).
- You can put multiple spacers in the same container — they **share** the remaining space equally.
:::
