---
sidebar_position: 7
---

# Gauge

Ring / linear progress indicators — perfect for percentages, activity rings, and battery levels. Maps to iOS's system `Gauge`, **designed primarily for lock screen accessories** (circular / rectangular widgets).

:::warning This isn't a normal component — children are required
A bare empty gauge renders just a plain ring, with no icon or number.
To make a meaningful gauge, **you must add `zstack` or `text` children**, and Omni places them into the gauge's various slots by rule.
:::

## Own properties

| Property | Description |
|----------|-------------|
| Content (value) | Current value — **a decimal between 0~1** (or a placeholder) |
| Style | One of 5 — see below |
| Color | Progress color, supports gradient |
| Scale | Overall size scaling |

### Style values

| Style | Maps to SwiftUI | What it looks like |
|-------|-----------------|--------------------|
| `auto` (default) | `.automatic` | System picks based on context |
| `acircular` | `.accessoryCircular` | Ring ⌬ |
| `acircularc` | `.accessoryCircularCapacity` | Ring as a capacity gauge (solid fill) |
| `alinear` | `.accessoryLinear` | Horizontal bar ▭ |
| `aLinearc` | `.accessoryLinearCapacity` | Linear capacity bar |

## The 4 child slots

When you add children to a gauge, Omni decides their position by "**type + order**":

| Slot | Source | Where it shows |
|------|--------|----------------|
| **label** (center / primary label) | First `zstack` child | Dead center of the ring |
| **currentValueLabel** (current value) | Last `zstack` child | Below the label (center value slot) |
| **minimumValueLabel** (minimum) | First `text` child | **Bottom-left** of the ring / line |
| **maximumValueLabel** (maximum) | Last `text` child | **Bottom-right** of the ring / line |

:::tip What if "first" and "last" are the same?
If you only add **1 zstack**, it serves as both label and currentValueLabel (both slots use it).
To show different content in the two slots, **add 2 zstacks** (order decides which is which).
Same for text: 1 → both left and right show it; 2 → first on the left, last on the right.
:::

## Example 1: Lock screen ring + center percentage

JS:
```js
const b = Device.battery()
this.level = b.level                          // 0.75
this.percent = Math.round(b.level * 100) + "%" // "75%"
```

Canvas structure:

```
gauge   (content: {level},  style: acircular)
  ├─ zstack
  │    └─ icon  (content: bolt.fill)            ← first zstack → center icon
  ├─ zstack
  │    └─ text  (content: {percent})            ← last zstack → value below
  ├─ text  (content: 0)                         ← first text → small bottom-left
  └─ text  (content: 100)                       ← last text → small bottom-right
```

Result: a ring at 75% with a lightning icon + "75%" in the center, and tiny `0` / `100` in the corners.

## Example 2: just a ring + one number in the center

Minimal-children setup: **just 1 zstack**.

```
gauge  (content: {level}, style: acircular)
  └─ zstack
       └─ text  (content: {percent})
```

Because there's only 1 zstack, it serves as both label and currentValueLabel — the number overlaps in the middle (it looks like a single number since the two slots are nearly identical).

## Example 3: linear progress bar with min/max marks

```
gauge  (content: {progress}, style: alinear)
  ├─ zstack
  │    └─ icon  (content: speaker.wave.2)        ← label, left-side icon
  ├─ zstack                                      ← placeholder, so currentValueLabel doesn't reuse the label
  ├─ text  (content: 0)
  └─ text  (content: 100)
```

## FAQ

**Q: Why does my gauge show only an empty ring, no number?**
A: Because there are no children. Go back to the canvas and tap the "+" on the gauge to add a `zstack` or `text`.

**Q: What's the difference between `acircularc` and `acircular`?**
A: `acircular` draws a ring line; `acircularc` fills the entire ring (like a cup of gradient water). The `c` suffix means "capacity/filled style"; without `c` it's "line style".

**Q: My progress is always full / empty.**
A: A gauge's "content" must be a decimal **between 0~1**, not a 0~100 percentage. If your JS computes `75`, use `this.level = 75 / 100`.

**Q: The color doesn't change?**
A: Color only affects the **progress portion** (bar / ring). Icon / text colors in the center zstack need to be set on those children individually.
