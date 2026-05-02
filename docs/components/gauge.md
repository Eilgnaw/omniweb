---
sidebar_position: 7
---

# 仪表 Gauge

环形 / 线性进度条,适合显示百分比、健康环、电量。底层对应 iOS 系统的 `Gauge`,**主要为锁屏附件设计**(圆形 / 矩形组件)。

:::warning 这不是普通组件 — 必须配合子组件
单独一个空的 gauge 只会画一根光秃秃的环,没有图标也没有数字。
要做出有意义的仪表,**必须往里面加 `zstack` 或 `text` 子组件**,Omni 会按规则把它们摆进 Gauge 的不同槽位。
:::

## 自身属性

| 属性 | 说明 |
|------|------|
| 内容 (value) | 当前值,**0~1 之间的小数**(或占位符) |
| 样式 (style) | 5 选 1,见下表 |
| 颜色 | 进度色,支持渐变 |
| 缩放 | 整体大小缩放 |

### 样式取值

| 样式 | 对应 SwiftUI | 长什么样 |
|------|-------------|---------|
| `auto` (默认) | `.automatic` | 由系统按上下文挑 |
| `acircular` | `.accessoryCircular` | 圆环 ⌬ |
| `acircularc` | `.accessoryCircularCapacity` | 圆环容量条(实心填充) |
| `alinear` | `.accessoryLinear` | 横线 ▭ |
| `aLinearc` | `.accessoryLinearCapacity` | 横线容量条 |

## 4 个子槽位

往 gauge 里加子组件时,Omni 按"**类型 + 出现顺序**"决定它们摆到哪:

| 槽位 | 来源 | 显示在哪 |
|------|------|---------|
| **label**(中心 / 主标签) | 第一个 `zstack` 子组件 | 圆环正中央 |
| **currentValueLabel**(当前值) | 最后一个 `zstack` 子组件 | label 的下方(圆环正中央数字位) |
| **minimumValueLabel**(最小值) | 第一个 `text` 子组件 | 圆环 / 横线**左下角** |
| **maximumValueLabel**(最大值) | 最后一个 `text` 子组件 | 圆环 / 横线**右下角** |

:::tip "第一个 / 最后一个"是同一个怎么办?
如果只放了 **1 个 zstack**,它会同时充当 label 和 currentValueLabel(两个槽都用它)。
要让两个槽显示不同内容,**得放 2 个 zstack**(顺序决定哪个是哪个)。
text 同理:1 个 → 左右都显示它,2 个 → 第一个左、最后一个右。
:::

## 例 1:锁屏圆环 + 中间百分比

JS:
```js
const b = Device.battery()
this.level = b.level                          // 0.75
this.percent = Math.round(b.level * 100) + "%" // "75%"
```

画布结构:

```
gauge   (内容: {level},  样式: acircular)
  ├─ zstack
  │    └─ icon  (内容: bolt.fill)            ← 第一个 zstack → 中心图标
  ├─ zstack
  │    └─ text  (内容: {percent})            ← 最后一个 zstack → 下方数值
  ├─ text  (内容: 0)                         ← 第一个 text → 左下小字
  └─ text  (内容: 100)                       ← 最后一个 text → 右下小字
```

效果:一个进度 75% 的圆环,中间是闪电图标 + "75%",左右下角各一个小数字 0 / 100。

## 例 2:只要纯环 + 中心一个数字

最少子组件方案:**只放 1 个 zstack**。

```
gauge  (内容: {level}, 样式: acircular)
  └─ zstack
       └─ text  (内容: {percent})
```

因为只有 1 个 zstack,它同时被用作 label 和 currentValueLabel —— 数字会重叠显示在中间(实际看起来就是一个数字,因为两个槽位置很近)。

## 例 3:横线进度条带左右刻度

```
gauge  (内容: {progress}, 样式: alinear)
  ├─ zstack
  │    └─ icon  (内容: speaker.wave.2)        ← label,左侧图标
  ├─ zstack                                   ← 占位,避免 currentValueLabel 用到 label 同一个
  ├─ text  (内容: 0)
  └─ text  (内容: 100)
```

## 常见问题

**Q: 为什么我的 gauge 只显示一个空圈,不显示数字?**
A: 因为没加任何子组件。回到画布,选中 gauge 的"+"添加 `zstack` 或 `text`。

**Q: `acircularc` 和 `acircular` 有啥区别?**
A: `acircular` 画一根环线,`acircularc` 把整个环填实(像一杯渐变水)。容量类的 `c` 后缀都是"填充式",非容量类是"线条式"。

**Q: 进度始终满格 / 空白?**
A: gauge 的"内容"必须是 **0~1** 之间的小数,不是 0~100 的百分数。如果 JS 算出来是 `75`,要 `this.level = 75 / 100`。

**Q: 颜色不变?**
A: 颜色只对**进度部分**(条 / 环)生效,中心 zstack 里的 icon / text 颜色得在它们各自的属性里改。
