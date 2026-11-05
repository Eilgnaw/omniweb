---
sidebar_position: 3
---

# Refresh and Live Activities

This page covers two jobs: suggesting the next refresh for a regular widget, and controlling a Live Activity from code or push.

## Regular widget refreshes

iOS decides the actual refresh time. These APIs submit a suggestion; they don't create a precise timer.

### Refresh after an interval

```js
setUpdateFreq(30) // suggest another refresh in 30 minutes
```

The argument is in minutes. Don't request an unnecessarily short interval; the system may combine or delay frequent refreshes.

### Refresh after a specific time

```js
const next = new Date()
next.setDate(next.getDate() + 1)
next.setHours(7, 0, 0, 0)

setUpdateTime(next.getTime())
```

The argument is a millisecond timestamp. This works well for cases such as “don't update overnight; refresh tomorrow morning.”

:::warning Refresh isn't an alarm
Widgets that people view often usually receive more refresh opportunities, but any suggestion may happen early, late, or not at all. For second-by-second changes, use the [Date component](../components/date.md) or a Live Activity.
:::

## End a Live Activity from JS

```js
endLiveActivity()
```

Use it from Button code in the Live Activity, or when there's nothing left to display.

## Control a Live Activity with push

Push can remotely start, update, and end a Live Activity.

### Prepare first

1. In the Live Activity editor's top-right menu, tap **Copy Push curl**.
2. Keep the endpoint, `user_id`, and `widget_id` from the example.
3. Have your server calculate the display values and encode them in `content_state.data`.

:::warning Push doesn't run the Live Activity's JavaScript
Remote `start`, `update`, and `end` only render variables from `content_state.data`. They don't execute the Live Activity JS or fetch network data. Your server or caller must prepare every value first.
:::

### Requirements

- Remote start requires iOS 17.2 or later.
- The device must have opened the app at least once so the app can upload the required system push information.
- Users only manage the one Push ID shown in the app, sent as `user_id`. Don't expose APNs tokens to them.
- `start`, `update`, and `end` use the same `user_id` and `widget_id` pair.
- After a remote start, the system creates the update channel asynchronously. Wait a few seconds before the first `update`.

### Endpoints

| Environment | Endpoint |
| --- | --- |
| Production | `POST https://omni.umiibo.app/api/push` |
| Sandbox | `POST https://omni.umiibo.app/api/sandbox/push` |

### Request fields

| Field | Required | Description |
| --- | --- | --- |
| `user_id` | ✓ | Push ID shown in the app |
| `widget_id` | ✓ | Live Activity widget ID |
| `type` | ✓ | `start`, `update`, or `end` |
| `content_state` |  | Render variables; `data` must be a JSON string |
| `alert_title` |  | Alert title used only by `start` |
| `alert_body` |  | Alert body used only by `start` |
| `sound_mode` |  | `custom`, `system`, or `silent`; defaults to `custom` |
| `sound` |  | Legacy custom sound filename |
| `silent` |  | Legacy option; `true` overrides other sound settings |
| `timestamp` | ✓ | Current Unix timestamp in seconds |
| `nonce` | ✓ | A different random string for every request |

### `content_state.data` is a string

The outer request is JSON, but `data` contains another JSON document encoded as a string:

```json
{
  "content_state": {
    "isLoading": false,
    "data": "{\"title\":\"Running\",\"count\":1}"
  }
}
```

`${title}` and `${count}` in the layout read this inner data.

### Start

```bash
curl -X POST https://omni.umiibo.app/api/push \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "your Push ID",
    "widget_id": "Live Activity widget ID",
    "type": "start",
    "sound_mode": "custom",
    "content_state": {
      "isLoading": false,
      "data": "{\"title\":\"Running\",\"count\":1}"
    },
    "alert_title": "Live Activity started",
    "alert_body": "A new Live Activity is showing",
    "timestamp": 1910000000,
    "nonce": "start-001"
  }'
```

Generate the current timestamp and a unique `nonce` for the real request. Don't copy the sample values.

### Update

Keep the same `user_id` and `widget_id`, change `type` to `update`, and supply the new variables:

```json
{
  "type": "update",
  "content_state": {
    "isLoading": false,
    "data": "{\"title\":\"Updated\",\"count\":2}"
  }
}
```

The request still needs a new `timestamp` and `nonce`.

### End

Change `type` to `end`. You may include a final set of display variables:

```json
{
  "type": "end",
  "content_state": {
    "isLoading": false,
    "data": "{\"title\":\"Ended\"}"
  }
}
```

The request still needs the same `user_id` and `widget_id`, plus a new `timestamp` and `nonce`.

## Push sound

| `sound_mode` | Behavior |
| --- | --- |
| `custom` | Plays the bundled `push_click.caf` |
| `system` | Plays the system default sound |
| `silent` | Sends a silent push |

The legacy `sound` field can name a bundled sound file. `silent: true` overrides every other sound setting.

## Quick reference

```js
setUpdateFreq(minutes) → void
setUpdateTime(timestampMs) → void
endLiveActivity() → void

POST /api/push type="start"  // remotely start
POST /api/push type="update" // update variables
POST /api/push type="end"    // end the activity
```
