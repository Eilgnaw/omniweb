---
sidebar_position: 8
---

# 捷径参数

闪控球识别文字后，会检查已启用的捷径。条件命中时，目标卡片收到 `$params.shortcut` 和 `$params.ocr`，可以提取取件码、金额或验证码。

## 最短示例

```js
const text = $params.ocr?.editedText || ""
const match = text.match(/取件码[:：\s]*([A-Z0-9-]{4,})/)
const code = match?.[1] || ""

if (code) Config.set("pickupCode", code)

let pickupCode = Config.get("pickupCode", "")
```

把文字“内容”设为 `${pickupCode}`。

## 参数

| 字段 | 内容 |
| --- | --- |
| `$params.shortcut.commandId` | 捷径 ID |
| `$params.shortcut.commandName` | 捷径名称 |
| `$params.shortcut.trigger` | 触发来源；闪控球为 `floatingBallOcr` |
| `$params.shortcut.matched` | 本次条件是否命中 |
| `$params.shortcut.capturedAt` | 识别时间戳，单位 ms |
| `$params.ocr.rawText` | 原始识别文字 |
| `$params.ocr.editedText` | 本次捷径使用的文字 |
| `$params.ocr.lines` | 按行拆分的字符串数组 |

## 示例：账单金额

```js
const text = $params.ocr?.editedText || ""
const match = text.match(/(?:合计|应付|支付)[:：\s]*¥?\s*([0-9]+(?:\.[0-9]{1,2})?)/)
const amount = match?.[1] || ""

if (amount) Config.set("billAmount", amount)
let billAmount = Config.get("billAmount", "")
```

## 示例：逐行找验证码

```js
const lines = $params.ocr?.lines || []
const target = lines.find((line) => line.includes("验证码")) || ""
const code = target.match(/([0-9]{4,8})/)?.[1] || ""

if (code) Config.set("smsCode", code)
```

## 注意事项

- 只有已启用且条件命中的捷径会执行。
- 一次识别可以命中多条捷径，并刷新多张目标卡片。
- `$params` 只对本次运行有效；需要长期保留时使用 `Config.set()`。
- 自动流程没有手动编辑时，`editedText` 与 `rawText` 相同。
