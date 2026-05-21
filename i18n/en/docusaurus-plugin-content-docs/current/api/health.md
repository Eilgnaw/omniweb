---
sidebar_position: 8
---

# Health

Read data from the system **Health** app. Requires the "Health" permission — the first call shows the system prompt; if the user denies, subsequent calls fail.

> You can re-request access anytime in the app under **Settings → Health Permission**, or jump to System Settings to manage each category individually.

## Steps / Distance / Active Energy / Flights

These APIs return the **cumulative value from local midnight to now** as a JS `number` (not a JSON string). Results are cached internally for 5 minutes to reduce authorization churn.

| API | Unit | Description |
|---|---|---|
| `Health.getStepsToday()` | steps | Today's step count |
| `Health.getActiveEnergyToday()` | kcal | Today's active energy |
| `Health.getDistanceToday()` | meters | Today's walking + running distance |
| `Health.getFlightsClimbedToday()` | flights | Today's flights climbed |

```js
const steps = await Health.getStepsToday()
const distance = await Health.getDistanceToday()
this.steps = `${steps} steps · ${(distance / 1000).toFixed(2)} km`
```

### Steps Over an Arbitrary Range

`Health.getStepsBetween(startMs, endMs)` returns the step count for a given range. Both arguments are **millisecond timestamps**.

```js
const now = Date.now()
const yesterday = now - 24 * 3600 * 1000
const steps = await Health.getStepsBetween(yesterday, now)
console.log(`Last 24 hours: ${steps} steps`)
```

## Heart Rate

Returns a JSON string with the shape `{ value, unit, date }`. `date` is a millisecond timestamp.

| API | Description |
|---|---|
| `Health.getLatestHeartRate()` | Most recent heart rate reading (bpm) |
| `Health.getRestingHeartRate()` | Most recent resting heart rate (bpm) |

```js
const result = await Health.getLatestHeartRate()
const { value, date } = JSON.parse(result)
this.hr = `${Math.round(value)} bpm`
```

Example response:

```json
{
  "value": 72.0,
  "unit":  "bpm",
  "date":  1700000000000
}
```

## Body Mass

`Health.getLatestBodyMass()` returns the most recent body mass reading in **kg**.

```js
const r = await Health.getLatestBodyMass()
const { value, date } = JSON.parse(r)
this.weight = `${value.toFixed(1)} kg`
```

## Today's Activity Rings

`Health.getActivitySummaryToday()` aggregates the **Move / Exercise / Stand** rings and their goals into a single JSON string.

```js
const r = await Health.getActivitySummaryToday()
const a = JSON.parse(r)

this.move     = `${Math.round(a.activeEnergyBurned)} / ${Math.round(a.activeEnergyBurnedGoal)} kcal`
this.exercise = `${Math.round(a.exerciseTime)} / ${Math.round(a.exerciseTimeGoal)} min`
this.stand    = `${Math.round(a.standHours)} / ${Math.round(a.standHoursGoal)} h`
```

Return structure:

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

If the user hasn't set an exercise or stand goal, those goal fields return `0`.

## Workouts

`Health.getRecentWorkouts(days)` returns workouts from the last N days, sorted by start time (most recent first). Pass `0` or a negative value and it defaults to 7 days.

```js
const r = await Health.getRecentWorkouts(7)
const workouts = JSON.parse(r)
this.count = `${workouts.length} workouts in the last 7 days`
```

Each entry:

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

- `activityType` is the raw value of [`HKWorkoutActivityType`](https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype) (e.g. `37` = walking, `52` = running).
- `duration` is in **seconds**, `activeEnergyBurned` in **kcal**, `totalDistance` in **meters**. Missing fields are returned as `null`.

## Last Night's Sleep Summary

```js
const result = await Health.getLastSleepDetail()
const obj = JSON.parse(result)

obj.sleepDatas.forEach(item => {
  console.log(`${categoryName(item.category)} - ${formatDuration(item.seconds)}`)
})
```

Return structure:

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

### Category Meanings

| category | Meaning | Notes |
|---------:|------|------|
| 2 | Awake | Not counted toward total sleep time |
| 3 | Core sleep | The bulk of sleep |
| 4 | Deep sleep | |
| 5 | REM sleep | |
| 99 | **Total sleep duration** (excluding awake) | Aggregated by Omni |

## Full Sleep Segments (Last 48 Hours)

If you want to draw your own timeline or analyze by segment:

```js
const result = await Health.getSleepData()
const arr = JSON.parse(result)
console.log(arr.length)
```

Returns an array, where each item is a **time segment**:

```json
{
  "startDate":  1738854640763,
  "endDate":    1738855510763,
  "value":      3,
  "sleepState": "sleepCore"
}
```

`sleepState` strings correspond one-to-one with `value`:

| value | sleepState | Meaning |
|------:|------------|------|
| 1 | `inBed`        | In bed (not asleep yet) |
| 2 | `Awake`        | Awake |
| 3 | `sleepCore`    | Core sleep |
| 4 | `asleepDeep`   | Deep sleep |
| 5 | `asleepREM`    | REM sleep |

<details>
<summary>Sample response (first few items only)</summary>

```json
[
  { "startDate": 1738854640763, "endDate": 1738855510763, "value": 3, "sleepState": "sleepCore" },
  { "startDate": 1738855510763, "endDate": 1738855870763, "value": 4, "sleepState": "asleepDeep" },
  { "startDate": 1738855870763, "endDate": 1738855900763, "value": 3, "sleepState": "sleepCore" },
  { "startDate": 1738855900763, "endDate": 1738855990763, "value": 2, "sleepState": "Awake" },
  ...
]
```

The full data is usually dozens to hundreds of segments — `console.log` it and check for yourself.
</details>

## Example: Show Last Night's Total Duration

```js
const result = await Health.getLastSleepDetail()
const obj = JSON.parse(result)
const total = obj.sleepDatas.find(d => d.category === 99)?.seconds || 0

const h = Math.floor(total / 3600)
const m = Math.floor((total % 3600) / 60)
this.sleep = `${h}h ${m}m`
```

Put `{sleep}` in a text component → shows `7h 10m`.

## Notes

- **No Apple Watch / no recorded data**: sleep APIs only read data written by Apple Watch and may return empty results. Other APIs (steps, heart rate, etc.) can read data recorded by the iPhone itself.
- **iOS Health permission**: prompts on first call. If denied, subsequent calls return an error. Re-request via the app's **Settings → Health Permission**, or jump to System Settings to manage each category.
- **Data is delayed**: Watch sync to iPhone usually takes a few minutes to an hour.
- **Widget memory limits**: Health APIs do not show the permission prompt from inside widgets — they only work after authorization has been granted in the main app.
