---
sidebar_position: 6
---

# 卡片控制

控制卡片刷新节奏、判断当前环境的几个全局函数。

## setUpdateFreq \{#setupdatefreq\}

```js
setUpdateFreq(30)    // 建议系统 30 分钟后再唤起刷新
```

| 参数 | 类型 | 说明 |
|---|---|---|
| `min` | number | 分钟数,**整数**,非数字 / 0 等价于「不调用」 |

主机侧 JS 跑完读 `__nextUpdate`,有 `freq` 就转成对应的 `formProvider.setFormNextRefreshTime` 调度。

:::warning 真的只是「建议」
鸿蒙 `FormExtension` 也是系统调度,你写 `setUpdateFreq(1)` 也不会真 1 分钟刷一次;系统会按热度、电量、网络等因素决定。MIN 是「**不要早于这个时间**」的下界。
:::

## setUpdateTime

```js
setUpdateTime(Date.now() + 60 * 60 * 1000)    // 1 小时后再刷
```

| 参数 | 类型 | 说明 |
|---|---|---|
| `ts` | number | 绝对时间戳(ms 单位),非数字 / 0 等价于「不调用」 |

跟 `setUpdateFreq` 互斥,**最后调用的那个生效**。建议用绝对时间的场景:倒计时类卡片(算到「下次整点」),用 `setUpdateTime` 比 `setUpdateFreq` 准。

## isDebug

```js
if (isDebug()) {
  console.log("调试态:JS 在编辑器里运行")
} else {
  // 卡片刷新路径
}
```

| 返回 | 说明 |
|---|---|
| `boolean` | 编辑器预览运行 → `true`;`FormExtension` 刷新 / 真机卡片 → `false` |

用来:调试时多打点日志,真机里跳过重试 / 跳过昂贵分支。

## sleep

```js
await sleep(500)    // 等 500ms
```

| 参数 | 类型 | 说明 |
|---|---|---|
| `ms` | number | 毫秒,非数字按 0 处理 |

主要用来给两次接口请求拉开间隔。**别在卡片侧滥用** —— 卡片侧 4.5s 上限,sleep 500ms 等于丢半秒预算。

## 速查

```js
// 调度
setUpdateFreq(min)        // min 分钟后再唤起;0/非数 = 不调用
setUpdateTime(ts)         // 绝对时间戳 ms;0/非数 = 不调用
                          // 两者互斥,最后调用的生效

// 环境判断
isDebug()                 → boolean       // 编辑器 = true,卡片 = false

// 流控
await sleep(ms)           → Promise<ms>
```
