---
sidebar_position: 8
---

# 健康

读取系统**健康** App 数据,目前**仅支持睡眠**。需要"健康"权限,且只读取 **Apple Watch 写入**的睡眠数据。

## 最近一晚的睡眠汇总

```js
const result = await Health.getLastSleepDetail()
const obj = JSON.parse(result)

obj.sleepDatas.forEach(item => {
  console.log(`${categoryName(item.category)} - ${formatDuration(item.seconds)}`)
})
```

返回结构:

```json
{
  "startDate": 1738854640763,
  "endDate":   1738879690763,
  "sleepDatas": [
    { "category": 4, "seconds": 3000  },
    { "category": 3, "seconds": 15030 },
    { "category": 2, "seconds": 2700  },
    { "category": 5, "seconds": 4320  },
    { "category": 99,"seconds": 22350 }
  ]
}
```

### category 含义

| category | 含义 | 备注 |
|---------:|------|------|
| 2 | 清醒 | 不计入睡眠总时长 |
| 3 | 核心睡眠 | 占大头 |
| 4 | 深度睡眠 | |
| 5 | 眼动睡眠 (REM) | |
| 99 | **总睡眠时长**(不含清醒) | 由 Omni 汇总而来 |

## 完整睡眠片段(最近 48 小时)

如果你想自己画时序图、按片段分析:

```js
const result = await Health.getSleepData()
const arr = JSON.parse(result)
console.log(arr.length)
```

返回数组,每项是一个**时间段**:

```json
{
  "startDate":  1738854640763,
  "endDate":    1738855510763,
  "value":      3,
  "sleepState": "sleepCore"
}
```

`sleepState` 字符串和 `value` 一一对应:

| value | sleepState | 含义 |
|------:|------------|------|
| 1 | `inBed`        | 在床上(尚未入睡) |
| 2 | `Awake`        | 清醒 |
| 3 | `sleepCore`    | 核心睡眠 |
| 4 | `asleepDeep`   | 深度睡眠 |
| 5 | `asleepREM`    | 眼动睡眠 |

<details>
<summary>样例返回(只展示前几项)</summary>

```json
[
  { "startDate": 1738854640763, "endDate": 1738855510763, "value": 3, "sleepState": "sleepCore" },
  { "startDate": 1738855510763, "endDate": 1738855870763, "value": 4, "sleepState": "asleepDeep" },
  { "startDate": 1738855870763, "endDate": 1738855900763, "value": 3, "sleepState": "sleepCore" },
  { "startDate": 1738855900763, "endDate": 1738855990763, "value": 2, "sleepState": "Awake" },
  ...
]
```

完整数据通常有几十到上百段,运行后用 `console.log` 自己看。
</details>

## 例:展示昨晚总时长

```js
const result = await Health.getLastSleepDetail()
const obj = JSON.parse(result)
const total = obj.sleepDatas.find(d => d.category === 99)?.seconds || 0

const h = Math.floor(total / 3600)
const m = Math.floor((total % 3600) / 60)
this.sleep = `${h}时${m}分`
```

text 组件填 `{sleep}` → 显示 `7时10分`。

## 注意

- **没有 Apple Watch / 没记录**:返回的 `sleepDatas` 可能为空或没有 `category 99`。
- **iOS 健康权限**:首次调用会弹窗。用户拒绝后,后续调用会返回错误。
- 数据**有滞后**:Watch 同步到 iPhone 通常要几分钟到一小时。
