---
sidebar_position: 9
---

# Divider

Divider uses the system separator between adjacent content and automatically follows its container direction.

## Direction

| Location | Direction |
| --- | --- |
| `vstack` | Horizontal, filling the container width |
| `hstack` | Vertical, filling the container height |
| Anywhere else | Horizontal |

## Common properties

| Property | What it does |
| --- | --- |
| Padding | Adds space at the ends or above and below the divider |
| Opacity | Adjusts how strong the divider appears |
| Runtime hidden | Uses a fixed value or placeholder to control visibility |

## Example: list separators

```text
vstack
├─ hstack (first row)
├─ divider (horizontal padding: 10)
└─ hstack (second row)
```

If the final row doesn't need a divider, set Runtime Hidden to `${item.hideDivider}` and return `1` for `hideDivider` on the last item.
