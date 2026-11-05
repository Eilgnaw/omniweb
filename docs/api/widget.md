---
sidebar_position: 4
---

# 小组件信息

`Widget` 是当前小组件的上下文对象。它会自动注入，不需要创建。

## 读取当前小组件

```js
console.log(Widget.id)
console.log(Widget.name)
console.log(Widget.type)
console.log(Widget.urlscheme)
```

| 属性 | 含义 |
| --- | --- |
| `id` | 小组件的持久 UUID |
| `name` | 用户设置的名称 |
| `type` | `small`、`medium`、`large`、`circular`、`rectangular`、`inline`、`button`、`toggle` 或 `live` |
| `urlscheme` | 打开后会在主 App 中重新运行当前小组件 JS 的 URL |

`Widget.urlscheme` 目前返回 `awidget://...`。Omni 同时支持更易识别的 `omniwidgets://...`，两者行为相同。

## 先确认代码运行在哪里

`Widget.openUrl()` 和 `Widget.reload()` 只在主 App 中生效：

- 在编辑器里点“运行”。
- 通过 `omniwidgets://runjs/...` 或 `Widget.urlscheme` 打开 Omni。

主屏幕小组件在扩展中自动刷新时，这两个方法不会执行操作，也不会报错。

## 打开 URL

```js
Widget.openUrl("https://2f0.cn")
Widget.openUrl("weixin://")
```

如果目标是“用户点击桌面小组件后跳转”，请设置 [Stack 的“打开 URL”](../components/stack.md#让容器可点击)，不要把 `Widget.openUrl()` 放进后台刷新代码。

## 请求刷新时间线

```js
Widget.reload()
```

它会请求系统重载当前小组件类型的所有时间线，适合主 App 中修改配置后使用。

:::warning `reload()` 不保证立即刷新
它只是通知 iOS 数据已经变化。系统仍然决定何时重新读取和显示内容。
:::

## 通过 URL 运行 JS

快捷指令或其他 App 可以打开：

```text
omniwidgets://runjs/medium/<widget-id>
```

还可以附带查询参数：

```text
omniwidgets://runjs/medium/<widget-id>?city=Shanghai&count=10
```

JavaScript 通过 `$params` 读取：

```js
const city = $params.city || "Shanghai"
Config.set("city", city)
Widget.reload()
```

## 示例：同步后打开其他 App

```js
const request = new Request("https://api.example.com/sync")
await request.fetchJSON()
Config.set("lastSync", Date.now())
Widget.reload()
Widget.openUrl("weixin://")
```

这段代码需要从编辑器或运行 URL 启动，不能依赖主屏幕小组件的后台刷新。

## 速查

```js
Widget.id → string
Widget.name → string
Widget.type → string
Widget.urlscheme → string
Widget.openUrl(url) → void // 仅主 App
Widget.reload() → void     // 仅主 App
$params → object           // 运行 URL 的查询参数
```
