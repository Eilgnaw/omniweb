---
sidebar_position: 7
---

# 仪表 Gauge

Gauge 用系统样式显示进度，适合百分比、电量和健康数据，尤其适合锁屏圆形或矩形组件。

## 开始前先记住两件事

1. “内容”必须是 `0` 到 `1` 的小数，而不是 `0` 到 `100`。
2. 中心图标、当前值和两端刻度由子组件提供。

```js
this.level = 0.75
this.percent = "75%"
```

## 样式

| 样式 | 系统样式 | 结果 |
| --- | --- | --- |
| `auto` | `.automatic` | 由系统选择 |
| `acircular` | `.accessoryCircular` | 圆环线 |
| `acircularc` | `.accessoryCircularCapacity` | 填充式圆形容量 |
| `alinear` | `.accessoryLinear` | 线性进度 |
| `aLinearc` | `.accessoryLinearCapacity` | 填充式线性容量 |

## 子组件放在哪里？

Omni 根据子组件的类型和顺序，把它们放进 Gauge 的系统槽位：

| 槽位 | 使用的子组件 | 位置 |
| --- | --- | --- |
| 主标签 `label` | 第一个 `zstack` | 中心或主标签位置 |
| 当前值 `currentValueLabel` | 最后一个 `zstack` | 当前值位置 |
| 最小值 `minimumValueLabel` | 第一个 `text` | 左端或左下角 |
| 最大值 `maximumValueLabel` | 最后一个 `text` | 右端或右下角 |

如果只有一个 ZStack，它会同时用于主标签和当前值；只有一个 Text 时，也会同时用于最小值和最大值。需要不同内容时，请分别添加两个。

## 示例：电量圆环

JavaScript：

```js
const battery = Device.battery()
this.level = battery.level
this.percent = Math.round(battery.level * 100) + "%"
```

组件结构：

```text
gauge（内容：${level}；样式：acircular）
├─ zstack
│  └─ icon（bolt.fill）
├─ zstack
│  └─ text（${percent}）
├─ text（0）
└─ text（100）
```

## 示例：只显示圆环和数字

```text
gauge（内容：${level}；样式：acircular）
└─ zstack
   └─ text（${percent}）
```

一个 ZStack 会同时填入两个中心槽位。系统布局可能让两份内容靠得很近；需要精确控制时，请添加两个 ZStack，并分别设置内容。

## 常见问题

### 为什么一直满格或空白？

检查内容是否在 `0...1` 范围内。`75%` 应写成 `0.75`。

### 为什么没有数字或图标？

Gauge 不会自动生成标签。请添加 ZStack 或 Text 子组件。

### 为什么改颜色后中心内容没有变化？

Gauge 的颜色只影响进度部分。中心 Icon 和 Text 要在各自的属性中设置颜色。
