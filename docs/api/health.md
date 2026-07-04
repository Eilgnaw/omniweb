---
sidebar_position: 8
---

# 健康

读取系统**健康** App 数据。需要"健康"权限,首次调用会弹窗,用户拒绝后再调用会失败。

> 在 App 的 **设置 → 健康权限** 里可以随时重新请求,或者跳转到系统设置中按项目精细管理。

## 步数 / 距离 / 活动能量 / 楼层

这一组接口都是**当地零点至现在的累计值**,直接返回 number(不是 JSON 字符串),数据会在内部缓存 5 分钟以减少授权抖动。

| 接口 | 单位 | 说明 |
|---|---|---|
| `Health.getStepsToday()` | 步 | 今日累计步数 |
| `Health.getActiveEnergyToday()` | kcal | 今日活动能量 |
| `Health.getDistanceToday()` | 米 | 今日步行 + 跑步距离 |
| `Health.getFlightsClimbedToday()` | 层 | 今日攀爬楼层 |

```js
const steps = await Health.getStepsToday()
const distance = await Health.getDistanceToday()
this.steps = `${steps} 步 · ${(distance / 1000).toFixed(2)} km`
```

### 任意区间步数

`Health.getStepsBetween(startMs, endMs)` 取指定时间段的累计步数,参数为**毫秒时间戳**。

```js
const now = Date.now()
const yesterday = now - 24 * 3600 * 1000
const steps = await Health.getStepsBetween(yesterday, now)
console.log(`过去 24 小时:${steps} 步`)
```

## 心率

返回 JSON 字符串,结构 `{ value, unit, date }`,`date` 是毫秒时间戳。

| 接口 | 说明 |
|---|---|
| `Health.getLatestHeartRate()` | 最近一次心率读数(bpm) |
| `Health.getRestingHeartRate()` | 最近一次静息心率(bpm) |

```js
const result = await Health.getLatestHeartRate()
const { value, date } = JSON.parse(result)
this.hr = `${Math.round(value)} bpm`
```

返回示例:

```json
{
  "value": 72.0,
  "unit":  "bpm",
  "date":  1700000000000
}
```

## 体重

`Health.getLatestBodyMass()` 取最近一次体重数据,单位 **kg**。

```js
const r = await Health.getLatestBodyMass()
const { value, date } = JSON.parse(r)
this.weight = `${value.toFixed(1)} kg`
```

## 今日活动环

`Health.getActivitySummaryToday()` 汇总**活动 / 锻炼 / 站立**三个环以及各自目标,返回 JSON 字符串。

```js
const r = await Health.getActivitySummaryToday()
const a = JSON.parse(r)

this.move     = `${Math.round(a.activeEnergyBurned)} / ${Math.round(a.activeEnergyBurnedGoal)} kcal`
this.exercise = `${Math.round(a.exerciseTime)} / ${Math.round(a.exerciseTimeGoal)} min`
this.stand    = `${Math.round(a.standHours)} / ${Math.round(a.standHoursGoal)} h`
```

返回结构:

```json
{
  "activeEnergyBurned":     320.5,
  "activeEnergyBurnedGoal": 400,
  "exerciseTime":           25,
  "exerciseTimeGoal":       30,
  "standHours":             10,
  "standHoursGoal":         12,
  "date":                   1700000000000
}
```

锻炼目标和站立目标如果用户没设,会返回 `0`。

## 训练记录

`Health.getRecentWorkouts(days)` 拉取最近 N 天的训练记录,按开始时间倒序。`days` 传 `0` 或负数时按 7 天处理。

```js
const r = await Health.getRecentWorkouts(7)
const workouts = JSON.parse(r)
this.count = `最近 7 天 ${workouts.length} 次训练`
```

每条结构:

```json
{
  "activityType":       37,
  "startDate":          1700000000000,
  "endDate":            1700001800000,
  "duration":           1800,
  "activeEnergyBurned": 280,
  "totalDistance":      4500
}
```

- `activityType` 对应 [`HKWorkoutActivityType`](https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype) 的 raw value(如 `37` = walking,`52` = running)。
- `duration` 单位**秒**,`activeEnergyBurned` 单位 **kcal**,`totalDistance` 单位**米**,数据缺失时为 `null`。

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

text 组件填 `${sleep}` → 显示 `7时10分`。

## 注意

- **没有 Apple Watch / 没记录**:睡眠相关接口仅读取 Apple Watch 写入的数据,可能为空。其它接口(步数、心率等)也会读取 iPhone 自身数据。
- **iOS 健康权限**:首次调用会弹窗。用户拒绝后,后续调用会直接返回错误。可通过 App 的"设置 → 健康权限"重新请求或跳转系统设置管理。
- **数据有滞后**:Watch 同步到 iPhone 通常要几分钟到一小时。
- **小组件内存限制**:健康相关接口在小组件中不会弹权限框,仅当主 App 已授权时才能正常读取。
