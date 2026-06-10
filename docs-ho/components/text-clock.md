---
sidebar_position: 9
---

# 时钟 TextClock

显示当前系统时间的文本组件。它不需要 JS,放到卡片上后会按系统时间自动更新。

## 用法

编辑器底部点 ➕ → 添加 **时钟**(`TextClock`),在「格式」字段填显示格式:

| 格式 | 显示示例 |
|------|----------|
| `HH:mm` | `17:00` |
| `aa hh:mm` | `上午 05:00` |
| `yyyy年M月d日` | `2026年6月5日` |
| `M月d日 EEEE` | `6月5日 星期五` |

不填 `format` 时跟随系统默认时间格式。卡片里常用 `HH:mm`。

## 属性

| 属性 (`attrs` key) | 类型 | 说明 |
|------|------|------|
| `format` | string | 时间格式,如 `HH:mm` / `yyyy/M/d` / `M月d日 EEEE` |
| `timeZoneOffset` | number | 时区偏移,东八区写 `-8`;留空跟随系统 |
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

常用字段:

| 字段 | 含义 | 示例 |
|------|------|------|
| `yyyy` / `yy` | 年 | `2026` / `26` |
| `M` / `MM` | 月 | `6` / `06` |
| `d` / `dd` | 日 | `5` / `05` |
| `E` / `EEEE` | 星期 | `周五` / `星期五` |
| `H` / `HH` | 24 小时制 | `7` / `07` |
| `h` / `hh` | 12 小时制 | `7` / `07` |
| `m` / `mm` | 分钟 | `8` / `08` |
| `a` | 上午 / 下午 | `上午` |

分隔符可以用 `/`、`-`、`.`、中文等:

```
yyyy/M/d
yyyy-MM-dd
yyyy年M月d日 EEEE
aa hh:mm
```

## 例:显示北京时间

`timeZoneOffset` 的正负号和常见 `UTC+8` 写法相反:东八区写 `-8`,西五区写 `5`。

| 字段 | 填什么 |
|------|--------|
| `format` | `HH:mm` |
| `timeZoneOffset` | `-8` |

## 注意事项

:::warning 卡片最小时间单位是分钟
鸿蒙卡片里的 `TextClock` 最小时间单位为分钟。不要在卡片里依赖 `ss`、`SS`、`SSS` 做秒级或毫秒级显示。
:::

:::tip 不需要 JS 刷新
`TextClock` 自己跟随系统时间变化,不用在 JS 里写 `setUpdateFreq`。
:::
