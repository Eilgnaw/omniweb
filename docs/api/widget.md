---
sidebar_position: 4
---

# 小组件信息

`Widget` 是一个**自动注入**的对象,代表当前正在运行的小组件。可以用它取小组件的 ID、类型、名字,
也能在**主 App 上下文**里触发跳转或刷新。

## 属性

```js
console.log(Widget.id)         // "ABCD-1234-EF56-..."  小组件唯一 UUID
console.log(Widget.name)       // "我的天气小组件"       小组件名
console.log(Widget.type)       // "small" | "medium" | "large" | "circular" | ...
console.log(Widget.urlscheme)  // "awidget://runjs/medium/ABCD..."  自动生成的回调 URL
```

| 属性 | 含义 |
|------|------|
| `id` | 小组件 UUID,持久化标识 |
| `name` | 用户起的名字 |
| `type` | 类型字符串(small / medium / large / circular / rectangular / inline / button / toggle / live) |
| `urlscheme` | 一个固定 URL,打开它会**重新跑一遍当前小组件的 JS**;常用来做按钮 / 快捷指令回调 |

## ⚠️ 关于运行环境

下面的 `openUrl` / `reload` 两个方法,**只在主 App 上下文里跑得动**;
也就是只有以下两种场景生效:

1. **编辑器里**:你在编辑小组件、点了"运行" — JS 跑在主 App 里
2. **通过 `Widget.urlscheme` 进入**:有人打开了 `awidget://runjs/...`(快捷指令、按钮、其它 App 跳转过来),iOS 把 Omni 拉起来,JS 在主 App 里跑

桌面上小组件**自己刷新时**,JS 是在 widget extension(独立沙盒)里跑的 — 这两个方法直接**变成空操作**,不会报错也不会生效。

## Widget.openUrl(url)

打开指定 URL(https、scheme 等)。

```js
Widget.openUrl("https://2f0.cn")
Widget.openUrl("weixin://")
Widget.openUrl(Widget.urlscheme)   // 等价于"重跑一遍我自己"
```

**仅在上面那两种场景生效**。如果你想做"用户在桌面点击小组件 → 跳到某个 URL",**不要**指望 `Widget.openUrl`,直接用 [stack 容器的"打开 URL"属性](../components/stack.md#openurl)即可。

## Widget.reload()

请求系统**重刷这个小组件类型的所有时间线**。

```js
Widget.reload()
```

典型用法:用户在主 App 里改了配置 / 数据,想立刻让桌面同步。
**也是只在主 App 上下文生效**(桌面 widget extension 跑的时候是空操作)。

:::info
"reload" 不是"立刻重画"的意思,只是告诉 iOS"我这边数据更新了,你可以来取了"。系统什么时候真去取仍由它决定。
:::

## 例:用快捷指令拉起,跑完 JS 再跳到第三方 App

快捷指令"打开 URL"填:

```
awidget://runjs/medium/<widget id>
```

这会让 Omni 主 App 启动并跑这个小组件的 JS。在 JS 里你可以做完事再跳走:

```js
const data = await new Request("https://api.example.com/sync").fetchJSON()
setConfig("lastSync", String(Date.now()))
Widget.openUrl("weixin://")    // 同步完接着打开微信
```

`runjs` URL 还能**带查询参数**透传到 JS,如:
```
awidget://runjs/medium/<widget id>?city=Shanghai&count=10
```
然后 JS 里通过 `$params` 取到(`$params.city`)。

## 例:主 App 里改完配置,触发桌面刷新

```js
setConfig("city", "Shanghai")
Widget.reload()  // 告诉系统:这个小组件类型的所有实例都该更新了
```
