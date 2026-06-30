---
sidebar_position: 10
---

# 计时器 TextTimer

显示计时信息的文本组件。支持正计时和倒计时,放到卡片上后会自动开始。

## 用法

编辑器底部点 ➕ → 添加 **计时器**(`TextTimer`),再设置「倒计时」「起点时间戳(ms) / 结束时间戳(ms)」和「格式」。

| 目标 | `isCountDown` | `count` | `startTime` | `format` |
|------|---------------|---------|-------------|----------|
| 正计时 | `false` | 可留空 | 可留空或 `Date.now()` | `mm:ss` |
| 从指定时间正计时 | `false` | 可留空 | 起点时间戳 | `HH:mm:ss` |
| 60 秒倒计时 | `true` | 已弃用 | `Date.now() + 60000` | `mm:ss` |
| 5 分钟倒计时 | `true` | 已弃用 | 结束时间戳 | `mm:ss` |
| 1 小时倒计时 | `true` | 已弃用 | 结束时间戳 | `HH:mm:ss` |

## 属性

| 属性 (`attrs` key) | 类型 | 说明 |
|------|------|------|
| `isCountDown` | boolean | 是否倒计时。`true` 时 `startTime` 表示结束时间戳;`false` 时 `startTime` 表示起点时间戳 |
| `count` | number | 已弃用,不再参与显示 |
| `startTime` | number | 唯一时间字段,单位毫秒。正计时显示当前时间减去它;倒计时显示它减去当前时间 |
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

在 JS 中生成 5 分钟后的结束时间戳:

```js
const endTime = Date.now() + 5 * 60 * 1000

return { startTime: endTime }
```

| 字段 | 填什么 |
|------|--------|
| `isCountDown` | `true` |
| `startTime` | `${startTime}` |
| `format` | `mm:ss` |
| `fontSize` | `28` |

## 例:正计时

| 字段 | 填什么 |
|------|--------|
| `isCountDown` | `false` |
| `format` | `mm:ss` |

`count` 已弃用,可以留空。

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

:::warning count 已弃用
倒计时不再读取 `count`,请用 `startTime` 传入结束时间戳。
:::

:::warning 倒计时最多显示 24 小时
倒计时结束时间超过当前时间 24 小时时,显示会截断到 24 小时;结束时间已过时显示 `00:00:00`。
:::

:::tip 不需要 JS 刷新
`TextTimer` 自己计时,不用在 JS 里写 `setUpdateFreq`。设置 `startTime` 后,组件重新可见时会按当前时间计算显示值。
:::
