---
sidebar_position: 3
---

# 控制台日志

用日志确认代码运行到了哪里、接口返回了什么，以及错误发生在哪一步。编辑器底部的“日志”面板会显示输出。

## 输出值

```js
console.log("开始加载")
console.info("步骤 1")
console.warn("使用缓存")
console.error("请求失败：", error)
console.debug("中间结果：", data)
```

所有方法都支持多个参数。对象和数组会自动转换为 JSON 文本。

## 配合错误处理

```js
let value = "--"

try {
  const data = await new Request(url).fetchJSON()
  value = data.value
} catch (error) {
  console.error("数据加载失败：", error)
}
```

只有希望脚本继续运行并显示回退内容时，才需要 `try...catch`。未捕获异常也会出现在日志面板中。

## 占位符为空时

```js
console.log("title：", title)
console.log("完整结果：", JSON.stringify(data, null, 2))
```

值是 `undefined` 时，检查 JavaScript 或数据路径；值正确时，再检查组件中的占位符。

:::warning 每次运行最多保留 200 条
超出部分会丢弃。不要在大循环中连续输出日志。
:::

桌面和锁屏卡片没有可见日志面板。请在编辑器中复现和调试。

## 速查

```js
console.log(...values)
console.info(...values)
console.warn(...values)
console.error(...values)
console.debug(...values)
```
