---
sidebar_position: 8
---

# 健康

`Health` 读取“健康”App 中已经存在的数据。首次使用必须在主 App 中授权；小组件后台运行时不能弹出权限框。

:::tip 先完成授权
在 Omni 的**设置 → 健康权限**中请求访问。用户可以随时到系统设置中调整具体数据类型的权限。
:::

## 先看返回类型

| 数据 | 返回 |
| --- | --- |
| 今日步数、距离、活动能量、楼层 | 数字，直接使用 |
| 心率、体重、活动环、训练、睡眠 | JSON 字符串，先 `JSON.parse()` |

## 今日活动数据

这些方法读取当地零点到现在的累计值，内部缓存约 5 分钟。

| 方法 | 单位 |
| --- | --- |
| `Health.getStepsToday()` | 步 |
| `Health.getActiveEnergyToday()` | kcal |
| `Health.getDistanceToday()` | m |
| `Health.getFlightsClimbedToday()` | 层 |

```js
const steps = await Health.getStepsToday()
const distance = await Health.getDistanceToday()

this.steps = Math.round(steps)
this.distance = (distance / 1000).toFixed(2) + " km"
```

### 指定时间段的步数

```js
const end = Date.now()
const start = end - 24 * 60 * 60 * 1000
this.steps = await Health.getStepsBetween(start, end)
```

两个参数都是毫秒时间戳。

## 心率

| 方法 | 内容 |
| --- | --- |
| `Health.getLatestHeartRate()` | 最近一次心率 |
| `Health.getRestingHeartRate()` | 最近一次静息心率 |

```js
const result = await Health.getLatestHeartRate()
const heartRate = JSON.parse(result)

this.bpm = Math.round(heartRate.value)
this.measuredAt = heartRate.date
```

返回结构：

```json
{
  "value": 72,
  "unit": "bpm",
  "date": 1700000000000
}
```

## 体重

```js
const result = await Health.getLatestBodyMass()
const bodyMass = JSON.parse(result)
this.weight = bodyMass.value.toFixed(1) + " kg"
```

`date` 是毫秒时间戳，`value` 单位为 kg。

## 今日活动环

```js
const result = await Health.getActivitySummaryToday()
const activity = JSON.parse(result)

this.move = `${Math.round(activity.activeEnergyBurned)} / ${Math.round(activity.activeEnergyBurnedGoal)} kcal`
this.exercise = `${Math.round(activity.exerciseTime)} / ${Math.round(activity.exerciseTimeGoal)} min`
this.stand = `${Math.round(activity.standHours)} / ${Math.round(activity.standHoursGoal)} h`
```

返回字段：

```json
{
  "activeEnergyBurned": 320.5,
  "activeEnergyBurnedGoal": 400,
  "exerciseTime": 25,
  "exerciseTimeGoal": 30,
  "standHours": 10,
  "standHoursGoal": 12,
  "date": 1700000000000
}
```

用户没有设置目标时，对应目标值可能为 `0`。

## 最近训练

```js
const result = await Health.getRecentWorkouts(7)
const workouts = JSON.parse(result)
this.workoutCount = workouts.length
```

参数是向前查询的天数；传 `0` 或负数时按 7 天处理。结果按开始时间倒序排列。

每条训练包含：

| 字段 | 内容 |
| --- | --- |
| `activityType` | `HKWorkoutActivityType` 的原始数字值 |
| `startDate` / `endDate` | 毫秒时间戳 |
| `duration` | 秒 |
| `activeEnergyBurned` | kcal，可能为 `null` |
| `totalDistance` | m，可能为 `null` |

活动类型数字见 Apple 的 [`HKWorkoutActivityType`](https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype)。

## 最近一晚睡眠汇总

```js
const result = await Health.getLastSleepDetail()
const sleep = JSON.parse(result)
const total = sleep.sleepDatas.find((item) => item.category === 99)?.seconds || 0

const hours = Math.floor(total / 3600)
const minutes = Math.floor((total % 3600) / 60)
this.sleep = `${hours} 小时 ${minutes} 分钟`
```

返回结构：

```json
{
  "startDate": 1738854640763,
  "endDate": 1738879690763,
  "sleepDatas": [
    { "category": 4, "seconds": 3000 },
    { "category": 3, "seconds": 15030 },
    { "category": 2, "seconds": 2700 },
    { "category": 5, "seconds": 4320 },
    { "category": 99, "seconds": 22350 }
  ]
}
```

| `category` | 含义 | 是否计入总睡眠 |
| ---: | --- | --- |
| 2 | 清醒 | 否 |
| 3 | 核心睡眠 | 是 |
| 4 | 深度睡眠 | 是 |
| 5 | REM 睡眠 | 是 |
| 99 | Omni 汇总的总睡眠时长 | — |

## 最近 48 小时的睡眠片段

需要绘制时间线时，读取原始片段：

```js
const result = await Health.getSleepData()
this.sleepSegments = JSON.parse(result)
```

每个片段包含：

```json
{
  "startDate": 1738854640763,
  "endDate": 1738855510763,
  "value": 3,
  "sleepState": "sleepCore"
}
```

| `value` | `sleepState` | 含义 |
| ---: | --- | --- |
| 1 | `inBed` | 在床上 |
| 2 | `Awake` | 清醒 |
| 3 | `sleepCore` | 核心睡眠 |
| 4 | `asleepDeep` | 深度睡眠 |
| 5 | `asleepREM` | REM 睡眠 |

## 没有数据时

- 用户可能没有授权这一类数据。
- 设备上可能还没有对应记录。
- Apple Watch 等设备同步到 iPhone 会有延迟。
- 小组件后台无法发起新的权限请求，只能读取主 App 已获准的数据。

请用 `try...catch` 设置回退内容，不要假设每个方法都会返回记录。

## 速查

```js
Health.getStepsToday() → Promise<number>
Health.getStepsBetween(startMs, endMs) → Promise<number>
Health.getActiveEnergyToday() → Promise<number>
Health.getDistanceToday() → Promise<number>
Health.getFlightsClimbedToday() → Promise<number>
Health.getLatestHeartRate() → Promise<string>
Health.getRestingHeartRate() → Promise<string>
Health.getLatestBodyMass() → Promise<string>
Health.getActivitySummaryToday() → Promise<string>
Health.getRecentWorkouts(days) → Promise<string>
Health.getLastSleepDetail() → Promise<string>
Health.getSleepData() → Promise<string>
```
