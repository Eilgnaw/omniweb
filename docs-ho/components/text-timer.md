---
sidebar_position: 10
---

# 计时器 TextTimer

显示计时信息的文本组件。支持正计时和倒计时,放到卡片上后会自动开始。

## 用法

编辑器底部点 ➕ → 添加 **计时器**(`TextTimer`),再设置「倒计时」「倒计时时长(ms)」「起点时间戳(ms)」和「格式」。

| 目标 | `isCountDown` | `count` | `startTime` | `format` |
|------|---------------|---------|-------------|----------|
| 正计时 | `false` | 可留空 | 可留空或 `Date.now()` | `mm:ss` |
| 从指定时间正计时 | `false` | 可留空 | 起点时间戳 | `HH:mm:ss` |
| 60 秒倒计时 | `true` | `60000` | 不生效 | `mm:ss` |
| 5 分钟倒计时 | `true` | `300000` | 不生效 | `mm:ss` |
| 1 小时倒计时 | `true` | `3600000` | 不生效 | `HH:mm:ss` |

## 属性

| 属性 (`attrs` key) | 类型 | 说明 |
|------|------|------|
| `isCountDown` | boolean | 是否倒计时。`true` 从 `count` 往 0 走;`false` 正计时 |
| `count` | number | 倒计时初始时长,单位毫秒;只在 `isCountDown=true` 时生效 |
| `startTime` | number | 正计时起点时间戳,单位毫秒;只在 `isCountDown=false` 时生效。显示值为当前时间减去该时间戳,超过 24 小时会按天循环 |
| `format` | string | 显示格式,如 `mm:ss` / `HH:mm:ss` / `ss` |
| `fontSize` | length | 字号,可写固定数字 `24` 或占位 `${size}` |
| `fontWeight` | enum | `normal` / `bold` / `medium` / `bolder` / `lighter` / `regular` |
| `fontName` | enum | 系统字体名(见编辑器下拉选项) |
| `forColor` | color | 文字色,`#000` 或 `${c}` |
| `width` / `height` | length | `auto` / `100` / `100%` / `${w}` |
| `padding` | padding4 | `8` 或 `8,8,8,8` |
| `backColor` | color | 背景色 |
| `cornerRadius` | length | 圆角 |
| `opacity` | number | 0..1 |

## 格式写法

`format` 至少包含下面一个字段:

| 字段 | 含义 |
|------|------|
| `HH` | 小时 |
| `mm` | 分钟 |
| `ss` | 秒 |
| `SS` | 厘秒 |

常用格式:

```
mm:ss
HH:mm:ss
ss
```

## 例:5 分钟倒计时

| 字段 | 填什么 |
|------|--------|
| `isCountDown` | `true` |
| `count` | `300000` |
| `format` | `mm:ss` |
| `fontSize` | `28` |

## 例:正计时

| 字段 | 填什么 |
|------|--------|
| `isCountDown` | `false` |
| `format` | `mm:ss` |

`count` 在正计时时不生效,可以留空。

## 例:秒级时钟

把 `startTime` 设为当天 00:00:00 的时间戳,并使用 `HH:mm:ss`:

```js
const now = new Date()
const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

return { startTime }
```

| 字段 | 填什么 |
|------|--------|
| `isCountDown` | `false` |
| `startTime` | `${startTime}` |
| `format` | `HH:mm:ss` |

`startTime` 固定为起点时间戳,组件会用当前时间减去它来显示已过时间。这样即使系统后台暂停绘制,重新可见后也会按当前时间补齐;到 24 小时后回到 `00:00:00`。

## 注意事项

:::warning count 单位是毫秒
`count = 60000` 表示 60 秒,不是 60000 秒。倒计时时长最长 24 小时(`86399999`)。
:::

:::warning startTime 只用于正计时
`isCountDown=true` 时会继续按 `count` 倒计时,不会读取 `startTime`。
:::

:::tip 不需要 JS 刷新
`TextTimer` 自己计时,不用在 JS 里写 `setUpdateFreq`。设置 `startTime` 后,组件重新可见时会按当前时间计算显示值。
:::
