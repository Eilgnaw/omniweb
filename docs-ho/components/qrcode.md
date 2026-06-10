---
sidebar_position: 4
---

# 二维码 QRCode

把一段文本生成二维码。适合放链接、订单号、会员码、Wi-Fi 信息、活动签到地址这类需要扫码读取的内容。

## 用法

编辑器底部点 ➕ → 添加 **二维码**(`QRCode`),然后设置:

| 字段 | 常用值 |
|---|---|
| 内容 `content` | `https://example.com` / `${url}` |
| 二维码色 `forColor` | `#000000` / `${color}` |
| 背景色 `backColor` | `#FFFFFF` |
| 宽 `width` / 高 `height` | `96` / `128` / `${size}` |

`content` 可以是固定文本,也可以绑定 JS 变量。只要最终结果是一段字符串,就会生成对应二维码。

## 属性

| 属性 (`attrs` key) | 类型 | 默认 | 说明 |
|------|------|------|------|
| `content` | string | `https://example.com` | 二维码内容,支持 `${...}` |
| `forColor` | color | `#000000` | 二维码前景色 |
| `backColor` | color | `#FFFFFF` | 二维码背景色 |
| `width` / `height` | length | `96` | 二维码尺寸 |
| `padding` / `margin` / `cornerRadius` / `opacity` | | | 通用外观字段 |

## 例:把接口返回的链接变成二维码

JS:

```js
const obj = await new Request("https://api.example.com/invite").fetchJSON()

let url = obj.url
let title = obj.title || "扫码打开"
```

组件:

| 组件 | 字段 | 填什么 |
|---|---|---|
| QRCode | `content` | `${url}` |
| QRCode | `width` / `height` | `120` |
| Text | `content` | `${title}` |

## 例:生成 Wi-Fi 二维码

```js
let ssid = "Office-WiFi"
let password = "12345678"
let wifiQr = `WIFI:T:WPA;S:${ssid};P:${password};;`
```

QRCode 的 `content` 填 `${wifiQr}`。

## 注意事项

:::tip 保持高对比度
二维码建议用深色前景 + 浅色背景。背景透明、颜色太浅或尺寸太小时,扫码成功率会明显下降。
:::

:::tip 尽量用正方形尺寸
二维码本身是正方形。`width` 和 `height` 建议填一样的值,例如 `96` / `120` / `160`。
:::

:::warning 内容为空会显示空白
如果 `content` 绑定的变量为空字符串或没有取到值,二维码可能显示为空白。动态数据建议准备兜底值。
:::
