---
sidebar_position: 8
---

# 捷径参数

闪控球文字识别捷径命中后,卡片刷新时会收到 `$params.shortcut` 和 `$params.ocr`。卡片 JS 可以读取识别文本,再用正则提取取件码、账单金额等信息。

## 基本用法

```js
const text = $params.ocr?.editedText || ""
const code = text.match(/取件码[:：\s]*([A-Z0-9-]{4,})/)?.[1] || ""

if (code) {
  Config.set("pickupCode", code)
}

const pickupCode = Config.get("pickupCode", "")
```

把文本组件内容绑定到 `${pickupCode}` 后,闪控球识别到取件码就会刷新显示;没有新命中时仍显示上次保存的值。

## 参数结构

```js
{
  shortcut: {
    commandId: "cmd_xxx",
    commandName: "短信取件码",
    trigger: "floatingBallOcr",
    matched: true,
    capturedAt: 1720000000000
  },
  ocr: {
    rawText: "文字识别原始文本",
    editedText: "文字识别原始文本",
    lines: ["第一行", "第二行"]
  }
}
```

| 字段 | 类型 | 说明 |
|---|---|---|
| `$params.shortcut.commandId` | string | 捷径 ID |
| `$params.shortcut.commandName` | string | 捷径名称 |
| `$params.shortcut.trigger` | string | 触发来源,闪控球为 `"floatingBallOcr"` |
| `$params.shortcut.matched` | boolean | 本次条件是否命中 |
| `$params.shortcut.capturedAt` | number | 截屏文字识别时间戳(ms) |
| `$params.ocr.rawText` | string | 文字识别原始文本 |
| `$params.ocr.editedText` | string | 捷径执行时使用的文本;自动流程没有编辑时等于 `rawText` |
| `$params.ocr.lines` | string[] | 按行拆分后的识别文本 |

## 常见提取示例

### 取件码

```js
const text = $params.ocr?.editedText || ""
const code = text.match(/取件码[:：\s]*([A-Z0-9-]{4,})/)?.[1] || ""

if (code) Config.set("pickupCode", code)

const pickupCode = Config.get("pickupCode", "")
```

### 账单金额

```js
const text = $params.ocr?.editedText || ""
const amount = text.match(/(?:合计|应付|支付)[:：\s]*¥?\s*([0-9]+(?:\.[0-9]{1,2})?)/)?.[1] || ""

if (amount) Config.set("billAmount", amount)

const billAmount = Config.get("billAmount", "")
```

### 逐行匹配

```js
const lines = $params.ocr?.lines || []
const target = lines.find(line => line.includes("验证码")) || ""
const code = target.match(/([0-9]{4,8})/)?.[1] || ""

if (code) Config.set("smsCode", code)
```

## 注意事项

- 捷径条件不命中时,不会刷新注入目标卡片;卡片 JS 通常只需要处理命中后的 `$params`。
- `$params` 只在本次刷新里有效;需要跨刷新保留结果时,用 `Config.set` 保存。
- 捷径可以把同一段识别文本注入多张卡片,每张卡片的 JS 各自用正则处理。
