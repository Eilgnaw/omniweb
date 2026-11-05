---
sidebar_position: 4
---

# 二维码

二维码把一段文字变成可扫码图案，适合链接、订单号、会员码、Wi-Fi 信息和签到地址。

## 最快用法

1. 添加**二维码**。
2. 在“内容”中填写固定文字或占位符。
3. 把宽和高设成相同值。

| 字段 | 常用填写 |
| --- | --- |
| 内容 | `https://example.com` / `${url}` |
| 二维码色 | `#000000` / `${color}` |
| 背景色 | `#FFFFFF` |
| 宽 / 高 | `120` |

## 属性

| 字段 | 常用填写 | 作用 |
| --- | --- | --- |
| 内容 | 固定文字或 `${url}` | 编码进二维码的内容 |
| 二维码色 | `#000000` / `${color}` | 前景颜色 |
| 宽 / 高、偏移、内外边距 | 数字或变量 | 通用布局字段 |
| 显示、背景色、圆角、旋转、不透明度 | 固定值或变量 | 通用视觉字段 |

## 示例：接口返回邀请链接

```js
const data = await new Request("https://api.example.com/invite").fetchJSON()
let url = data.url || "https://example.com"
let title = data.title || "扫码打开"
```

二维码“内容”设为 `${url}`，旁边文字设为 `${title}`。

## 示例：Wi-Fi 二维码

```js
let ssid = "Office-WiFi"
let password = "12345678"
let wifiQr = `WIFI:T:WPA;S:${ssid};P:${password};;`
```

“内容”设为 `${wifiQr}`。

:::tip 保持清晰易扫
使用深色前景、浅色背景和正方形尺寸。内容为空、对比度太低或尺寸太小时，扫码成功率会下降。
:::
