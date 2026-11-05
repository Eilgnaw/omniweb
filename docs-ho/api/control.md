---
sidebar_position: 7
---

# 卡片控制

这些全局函数用于建议下次刷新时间、判断运行环境和短暂等待。

## 按间隔刷新

```js
setUpdateFreq(30) // 建议系统 30 分钟后刷新
```

参数单位为分钟。`0` 或无效值不会设置刷新。

## 在指定时间后刷新

```js
const next = new Date()
next.setDate(next.getDate() + 1)
next.setHours(7, 0, 0, 0)

setUpdateTime(next.getTime())
```

参数是毫秒时间戳。`setUpdateFreq()` 与 `setUpdateTime()` 同时出现时，最后一次调用生效。

:::warning 刷新不是准点闹钟
系统决定实际刷新时间。秒级时钟和倒计时请使用对应组件，不要把间隔设得很短。
:::

## 判断是否在编辑器中运行

```js
if (isDebug()) {
  console.log("当前在编辑器中运行")
}
```

编辑器返回 `true`，桌面和锁屏卡片刷新返回 `false`。适合控制调试日志或只在编辑器中执行的准备工作。

## 短暂等待

```js
await sleep(300)
```

参数单位为毫秒。等待时间也会占用 4.5 秒运行预算，不要用它模拟定时器。

## 速查

```js
setUpdateFreq(minutes) → void
setUpdateTime(timestampMs) → void
isDebug() → boolean
sleep(ms) → Promise<string> // 返回等待毫秒数的字符串
```
