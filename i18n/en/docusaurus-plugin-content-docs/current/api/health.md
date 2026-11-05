---
sidebar_position: 8
---

# Health

`Health` reads data that already exists in the Health app. You must authorize access in the main app first; a background widget can't show a permission prompt.

:::tip Authorize first
Request access in Omni under **Settings → Health Permission**. The user can change access for individual data types later in System Settings.
:::

## Check the return type first

| Data | Return value |
| --- | --- |
| Today's steps, distance, active energy, and flights | Number; use it directly |
| Heart rate, body mass, activity rings, workouts, and sleep | JSON string; call `JSON.parse()` first |

## Today's activity data

These methods read the cumulative value from local midnight to now. Results are cached internally for about five minutes.

| Method | Unit |
| --- | --- |
| `Health.getStepsToday()` | steps |
| `Health.getActiveEnergyToday()` | kcal |
| `Health.getDistanceToday()` | meters |
| `Health.getFlightsClimbedToday()` | flights |

```js
const steps = await Health.getStepsToday()
const distance = await Health.getDistanceToday()

this.steps = Math.round(steps)
this.distance = (distance / 1000).toFixed(2) + " km"
```

### Steps in a time range

```js
const end = Date.now()
const start = end - 24 * 60 * 60 * 1000
this.steps = await Health.getStepsBetween(start, end)
```

Both arguments are millisecond timestamps.

## Heart rate

| Method | Content |
| --- | --- |
| `Health.getLatestHeartRate()` | Most recent heart rate |
| `Health.getRestingHeartRate()` | Most recent resting heart rate |

```js
const result = await Health.getLatestHeartRate()
const heartRate = JSON.parse(result)

this.bpm = Math.round(heartRate.value)
this.measuredAt = heartRate.date
```

Return shape:

```json
{
  "value": 72,
  "unit": "bpm",
  "date": 1700000000000
}
```

## Body mass

```js
const result = await Health.getLatestBodyMass()
const bodyMass = JSON.parse(result)
this.weight = bodyMass.value.toFixed(1) + " kg"
```

`date` is a millisecond timestamp, and `value` is in kg.

## Today's activity rings

```js
const result = await Health.getActivitySummaryToday()
const activity = JSON.parse(result)

this.move = `${Math.round(activity.activeEnergyBurned)} / ${Math.round(activity.activeEnergyBurnedGoal)} kcal`
this.exercise = `${Math.round(activity.exerciseTime)} / ${Math.round(activity.exerciseTimeGoal)} min`
this.stand = `${Math.round(activity.standHours)} / ${Math.round(activity.standHoursGoal)} h`
```

Return fields:

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

A goal may be `0` when the user hasn't set it.

## Recent workouts

```js
const result = await Health.getRecentWorkouts(7)
const workouts = JSON.parse(result)
this.workoutCount = workouts.length
```

The argument is the number of days to look back. `0` or a negative number defaults to 7 days. Results are sorted newest first.

Each workout contains:

| Field | Content |
| --- | --- |
| `activityType` | Raw numeric value from `HKWorkoutActivityType` |
| `startDate` / `endDate` | Millisecond timestamps |
| `duration` | Seconds |
| `activeEnergyBurned` | kcal; may be `null` |
| `totalDistance` | Meters; may be `null` |

See Apple's [`HKWorkoutActivityType`](https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype) for activity values.

## Last night's sleep summary

```js
const result = await Health.getLastSleepDetail()
const sleep = JSON.parse(result)
const total = sleep.sleepDatas.find((item) => item.category === 99)?.seconds || 0

const hours = Math.floor(total / 3600)
const minutes = Math.floor((total % 3600) / 60)
this.sleep = `${hours}h ${minutes}m`
```

Return shape:

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

| `category` | Meaning | Included in total sleep |
| ---: | --- | --- |
| 2 | Awake | No |
| 3 | Core sleep | Yes |
| 4 | Deep sleep | Yes |
| 5 | REM sleep | Yes |
| 99 | Total sleep aggregated by Omni | — |

## Sleep segments from the last 48 hours

Read raw segments when you need to draw a timeline:

```js
const result = await Health.getSleepData()
this.sleepSegments = JSON.parse(result)
```

Each segment contains:

```json
{
  "startDate": 1738854640763,
  "endDate": 1738855510763,
  "value": 3,
  "sleepState": "sleepCore"
}
```

| `value` | `sleepState` | Meaning |
| ---: | --- | --- |
| 1 | `inBed` | In bed |
| 2 | `Awake` | Awake |
| 3 | `sleepCore` | Core sleep |
| 4 | `asleepDeep` | Deep sleep |
| 5 | `asleepREM` | REM sleep |

## When there is no data

- The user may not have authorized that data type.
- The device may not have a matching record yet.
- Data from Apple Watch and other devices can take time to sync to the iPhone.
- A background widget can't request new permission; it can only read data already authorized in the main app.

Use `try...catch` and provide fallback content. Don't assume every method returns a record.

## Quick reference

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
