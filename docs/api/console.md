---
sidebar_position: 13
---

# 控制台 Console

用控制台确认代码运行到了哪里、接口返回了什么，以及错误发生在哪一步。日志会显示在编辑器的“控制台”面板中。

## 输出值

```js
console.log("开始加载")
console.log("数量：", 42)
console.log({ title: "天气", values: [1, 2, 3] })
```

多个参数会用空格连接；对象和数组会自动转换为 JSON 文本。

## 输出错误

```js
console.error("加载失败")
console.error(error)
```

错误日志带有 `[error]` 前缀，更容易识别。

## 配合 `try...catch`

```js
try {
  const request = new Request(url)
  const data = await request.fetchJSON()
  this.value = data.value
} catch (error) {
  console.error("请求失败：", error)
  this.value = "--"
}
```

## 占位符为空时

先输出要显示的变量：

```js
console.log("title：", this.title)
console.log("完整结果：", JSON.stringify(data, null, 2))
```

如果值是 `undefined`，问题在 JavaScript 或数据路径；如果值正确，再检查组件里的占位符。

## 只在编辑器中输出

`isDebug()` 在编辑器运行时返回 `true`：

```js
if (isDebug()) {
  console.log("调试数据：", data)
}
```

:::warning 桌面小组件没有可见控制台
控制台只收集编辑器里运行产生的日志。发布或保存前，请在编辑器中完成调试，并为失败情况准备回退内容。
:::

## 速查

```js
console.log(...values)   // 普通日志
console.error(...values) // 错误日志
isDebug() → boolean      // 当前是否在编辑器调试位运行
```
