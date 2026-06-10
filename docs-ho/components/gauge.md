---
sidebar_position: 7
---

# 仪表 Gauge

显示一个环形进度仪表。适合做电量、完成率、健康分、预算占用这类「一个数落在一个范围里」的展示。

## 用法

编辑器底部点 ➕ → 添加 **仪表**(`Gauge`),然后设置:

| 字段 | 常用值 |
|---|---|
| 当前值 `value` | `0.72` / `${progress}` |
| 最小值 `min` | `0` |
| 最大值 `max` | `1` / `100` |
| 颜色 `gaugeColors` | 在颜色编辑器里选「单色 / 线性 / 分段」 |

`Gauge` 的中心内容和说明文字都通过子节点表达,但只消费 **Stack / ZStack**:

```
仪表 (Gauge)
 ├─ 叠放 (Stack)        ← 中心内容
 │   └─ 文本 (Text, content = "72%")
 └─ 叠放 (Stack)        ← description(API 23+)
     └─ 文本 (Text, content = "今日")
```

如果只有 1 个可见 `Stack` / `ZStack` 子节点,它只作为中心内容,不会重复作为 description。

## 属性

| 属性 (`attrs` key) | 类型 | 默认 | 说明 |
|------|------|------|------|
| `value` | number | `0.6` | 当前值,支持 `${...}` |
| `min` | number | `0` | 最小值,总会显式传给系统 Gauge |
| `max` | number | `1` | 最大值,总会显式传给系统 Gauge |
| `startAngle` | number | `210` | 起始角度 |
| `endAngle` | number | `150` | 终止角度 |
| `strokeWidth` | length | `12` | 环宽,不支持百分比;写 `0` / 负数会忽略 |
| `gaugeColors` | gaugeColors | 单色 `#0A59F7` | 专用颜色模型,用颜色编辑器配置;支持整段 `${...}` |
| `width` / `height` / `padding` / `backColor` / `cornerRadius` / `opacity` | | | 同 Stack |

## 颜色

`Gauge` 颜色不是普通文本字段。编辑器会打开专用颜色面板:

- **单色**:一整条仪表环用同一个颜色。
- **线性**:用多个色标做 `LinearGradient`,每个色标有颜色和 `offset`。
- **分段**:最多 9 段,每段有颜色和权重;权重非法时按 `0` 处理。

动态颜色时,在颜色面板的「变量绑定」里填 `${gaugeColors}`,JS 顶层变量返回对象:

```js
let gaugeColors = {
  kind: "segments",
  segments: [
    { color: "#34C759", weight: 30 },
    { color: "#FF9500", weight: 40 },
    { color: "#FF3B30", weight: 30 },
  ],
}
```

线性渐变:

```js
let gaugeColors = {
  kind: "linear",
  stops: [
    { color: "#0A59F7", offset: 0 },
    { color: "#34C759", offset: 1 },
  ],
}
```

单色:

```js
let gaugeColors = {
  kind: "single",
  color: "#0A59F7",
}
```

## 子节点规则

`Gauge` 只把可见 `Stack` / `ZStack` 子节点当槽位:

| 子节点情况 | 渲染结果 |
|---|---|
| 没有 Stack | 只显示仪表环 |
| 1 个 Stack | 第 1 个 Stack 渲染到中心 |
| 2 个及以上 Stack | 第 1 个 Stack 渲染到中心,最后 1 个 Stack 渲染为 description |
| 直接放 Text / Image / Icon | 不作为 Gauge 槽位消费 |

如果要显示中心百分比、标题、单位,把它们放进第一个 `Stack`。如果要显示说明文字,放进最后一个 `Stack`。

## 例:动态完成率

JS:

```js
let done = 72
let progress = done / 100
```

Gauge:

| 字段 | 填什么 |
|---|---|
| `value` | `${progress}` |
| `min` | `0` |
| `max` | `1` |
| `startAngle` | `210` |
| `endAngle` | `150` |

中心 Stack 里放 Text:

| 组件 | 字段 | 填什么 |
|---|---|---|
| Text | `content` | `${done}%` |
| Text | `fontSize` | `18` |

## 注意事项

:::warning description 需要 API 23+
Gauge 的原生 `description` 只在 HarmonyOS API 23+ 调用。低于 API 23 时,description Stack 不显示,卡片不会因此崩溃。
:::

:::tip Text 不是 min / max 槽位
Harmony Gauge 的 `min` / `max` 是数值范围参数,不是两个独立视图。不要把 Text 直接塞到 Gauge 下面当 min / max 标签;需要文字就放进中心 Stack 或 description Stack。
:::

:::tip 分段颜色最多 9 段
超过 9 段会截断。空颜色不会调用 `.colors()`,避免把非法颜色传给系统组件。
:::
