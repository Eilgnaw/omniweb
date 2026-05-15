---
sidebar_position: 8
---

# Health

Read data from the system **Health** app. Currently **sleep only**. Requires the "Health" permission, and only reads sleep data **written by an Apple Watch**.

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

- **No Apple Watch / no recorded data**: `sleepDatas` may be empty or have no `category 99`.
- **iOS Health permission**: prompts on first call. If denied, subsequent calls throw an error.
- Data is **delayed**: Watch sync to iPhone usually takes a few minutes to an hour.
