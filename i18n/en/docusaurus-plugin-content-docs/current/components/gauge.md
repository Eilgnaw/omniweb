---
sidebar_position: 7
---

# Gauge

Gauge displays progress with system styling. Use it for percentages, battery levels, and health data, especially in circular or rectangular Lock Screen widgets.

## Remember two things first

1. Content must be a decimal from `0` to `1`, not a number from `0` to `100`.
2. Child components supply the center icon, current value, and endpoint labels.

```js
this.level = 0.75
this.percent = "75%"
```

## Styles

| Style | System style | Result |
| --- | --- | --- |
| `auto` | `.automatic` | Chosen by the system |
| `acircular` | `.accessoryCircular` | Ring outline |
| `acircularc` | `.accessoryCircularCapacity` | Filled circular capacity |
| `alinear` | `.accessoryLinear` | Linear progress |
| `aLinearc` | `.accessoryLinearCapacity` | Filled linear capacity |

## Where do children go?

Omni maps children to system Gauge slots by type and order:

| Slot | Child used | Position |
| --- | --- | --- |
| Primary `label` | First `zstack` | Center or primary label area |
| `currentValueLabel` | Last `zstack` | Current-value area |
| `minimumValueLabel` | First `text` | Left edge or bottom-left |
| `maximumValueLabel` | Last `text` | Right edge or bottom-right |

With only one ZStack, it fills both the primary and current-value slots. One Text fills both endpoint slots. Add two when the slots need different content.

## Example: battery ring

JavaScript:

```js
const battery = Device.battery()
this.level = battery.level
this.percent = Math.round(battery.level * 100) + "%"
```

Component tree:

```text
gauge (Content: ${level}; Style: acircular)
├─ zstack
│  └─ icon (bolt.fill)
├─ zstack
│  └─ text (${percent})
├─ text (0)
└─ text (100)
```

## Example: ring and number only

```text
gauge (Content: ${level}; Style: acircular)
└─ zstack
   └─ text (${percent})
```

One ZStack fills both center slots. The system layout may place the duplicate content very close together. For exact control, add two ZStacks and configure them separately.

## Troubleshooting

### Why is it always full or empty?

Make sure Content is in the `0...1` range. Write `0.75` for 75%.

### Why is there no number or icon?

Gauge doesn't generate labels automatically. Add ZStack or Text children.

### Why didn't the center content change color?

The Gauge color only affects the progress indicator. Set colors on the center Icon and Text themselves.
