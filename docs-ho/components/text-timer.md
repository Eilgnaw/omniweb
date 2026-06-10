---
sidebar_position: 10
---

# 计时器 TextTimer

显示计时信息的文本组件。支持正计时和倒计时,放到卡片上后会自动开始。

## 用法

编辑器底部点 ➕ → 添加 **计时器**(`TextTimer`),再设置「倒计时」「倒计时时长(ms)」和「格式」。

| 目标 | `isCountDown` | `count` | `format` |
|------|---------------|---------|----------|
| 正计时 | `false` | 可留空 | `mm:ss` |
| 60 秒倒计时 | `true` | `60000` | `mm:ss` |
| 5 分钟倒计时 | `true` | `300000` | `mm:ss` |
| 1 小时倒计时 | `true` | `3600000` | `HH:mm:ss` |

## 属性

| 属性 (`attrs` key) | 类型 | 说明 |
|------|------|------|
| `isCountDown` | boolean | 是否倒计时。`true` 从 `count` 往 0 走;`false` 正计时 |
| `count` | number | 倒计时初始时长,单位毫秒;只在 `isCountDown=true` 时生效 |
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

## 注意事项

:::warning count 单位是毫秒
`count = 60000` 表示 60 秒,不是 60000 秒。倒计时时长最长 24 小时(`86399999`)。
:::

:::tip 不需要 JS 刷新
`TextTimer` 自己计时,不用在 JS 里写 `setUpdateFreq`。组件不可见时,系统可能停止绘制时间变化。
:::
