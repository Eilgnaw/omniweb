---
sidebar_position: 13
---

# 控制台 Console

调试用。在编辑器底部"控制台"面板可以看到所有 `console.log` 输出。

## 基础

```js
console.log("hello")
console.log("数量:", 42)
console.log({ a: 1, b: [1, 2, 3] })  // 对象/数组会自动 JSON.stringify
```

## 多个参数

支持多个参数,中间会用空格连接:

```js
console.log("姓名:", name, "年龄:", age)
// 姓名: Alice 年龄: 18
```

## 错误日志

```js
console.error("出问题了")
console.error(err)
```

效果与 `console.log` 一样,但日志前会带 `[error]` 前缀,方便筛选。

## try / catch 配合

异步接口推荐都包一层:

```js
try {
  const data = await new Request(url).fetchJSON()
  this.value = data.value
} catch (e) {
  console.error("拉数据失败:", e)
  this.value = "--"
}
```

## 调试小技巧

- 控制台只在**编辑器里运行**才能看到。**桌面上的小组件运行时**没有"控制台"。
- 想知道某个变量到底是什么,直接 `console.log(JSON.stringify(obj, null, 2))`。
- 排查占位符不显示时,先 `console.log` 看变量值是不是 `undefined`。
- `isDebug()` 全局函数返回当前是否在编辑器里调试 — 可以做"只调试时打日志"的开关。

```js
if (isDebug()) {
  console.log("调试信息:", obj)
}
```
