---
sidebar_position: 3
---

# 控制台日志

调试用。`console.*` 调用累积到一个内存队列,主 App 编辑器的「日志」面板会展示。

## 接口

```js
console.log("hello")
console.info("step 1")
console.warn("fallback used")
console.error("fetch failed:", err.message)
console.debug("intermediate:", obj)
```

5 个 level 都支持:`log` / `info` / `warn` / `error` / `debug`。

## 多参数 / 对象

任意个参数,**对象自动 `JSON.stringify`**(失败回退到 `String(...)`),参数之间空格拼接:

```js
const user = { name: "Alice", age: 30 }
console.log("user =", user, "tags:", ["vip", "new"])
// → user = {"name":"Alice","age":30} tags: ["vip","new"]
```

`null` / `undefined` 显式打印成 `"null"` / `"undefined"`。

## 注意事项

:::warning 单次 eval 上限 200 条
为防卡片侧 JS 误打日志撑爆内存,**单次运行最多保留 200 条**,超出部分静默丢弃。压力测试 / 性能问题排查请别 `console.log` in tight loop。
:::

:::tip 卡片侧也能打,但看不到
`FormExtensionAbility` 跑的 JS 也会累积 `console.*`,但卡片侧没有 UI 展示日志,只是写到 host 内存里。要看的话只能在主 App 编辑器里运行同一段代码复现。
:::

:::tip 异常会被自动捕获
JS 顶层 `throw new Error(...)` / `await req.fetchJSON()` 失败之类,Omni 主机侧会捕获并标记成 `error` 状态,异常信息也能在日志面板看到 —— 不必自己写 `try { ... } catch (e) { console.error(e) }` 就为了打个日志,**只在你想兜底继续跑时才 try/catch**。
:::

## 速查

```js
console.log(...args)    // 普通
console.info(...args)
console.warn(...args)
console.error(...args)
console.debug(...args)

// 输出格式:对象 → JSON.stringify;null/undefined → 字面量;其它 → String()
// 上限:每次 eval 最多 200 条
```
