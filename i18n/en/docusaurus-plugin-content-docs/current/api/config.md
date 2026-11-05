---
sidebar_position: 2
---

# Config and settings

Omni has three kinds of persistent data. Choose by scope first, and the rest of your code stays simpler.

| What you need to save | Use | Scope |
| --- | --- | --- |
| Data owned by this widget | `Config` | Isolated per widget |
| Button state for one Home Screen slot | `getValue` / `setValue` | Widget type + system slot |
| A value the user fills in from Settings | `Setting` | Isolated per widget |

Use `Config` by default in new code. Choose the others only when you specifically need slot state or a user-facing settings panel.

## `Config`: store data for this widget

`Config` preserves numbers, booleans, strings, arrays, and objects.

```js
Config.set("count", 42)
Config.set("enabled", true)
Config.set("items", [1, 2, 3])
Config.set("user", { name: "Alice" })

const count = Config.get("count")       // 42
const enabled = Config.get("enabled")   // true
const missing = Config.get("missing")   // undefined
```

### Provide a default while reading

```js
const page = Config.get("page", 0)
const recent = Config.get("recent", [])
const profile = Config.get("profile", { name: "" })
```

The second argument is returned when the key doesn't exist or the stored value is corrupted.

### Check, list, and delete

```js
if (Config.has("token")) {
  console.log(Config.get("token"))
}

console.log(Config.keys())
Config.delete("token")
```

Setting `null` or `undefined` also deletes the key:

```js
Config.set("token", null)
```

:::warning Store JSON-compatible values only
Use strings, numbers, booleans, `null`, arrays, and plain objects. Functions, circular references, and similar values can't be serialized reliably.
:::

## `setConfig` / `getConfig`: legacy string storage

```js
setConfig("token", "abcdef")
const token = getConfig("token")
```

These APIs only store strings. They remain for older widgets and Shortcuts interoperability. Use `Config` in new code.

:::warning The two key spaces are separate
`Config.get("token")` can't read a value stored by `setConfig("token", ...)`. Copy it once when you migrate:

```js
Config.set("token", getConfig("token"))
```
:::

## `getValue` / `setValue`: store by Home Screen slot

```js
setValue("favorite", "heart.fill")
const icon = getValue("favorite")
```

These APIs store strings by “widget type + system slot.” They're useful for lightweight state changed by a Button. Runs in the editor use debug slot `999`.

:::warning Don't use this for important data
iOS decides the slot. Removing, re-adding, or moving a widget can change it. Use `Config` for important data.
:::

## `Setting`: read values entered by the user

When sharing a template, use settings so each person can enter their own city, token, color, image, or file.

### Create settings in the editor

1. Open the widget's settings panel.
2. Add a setting, choose its type, and enter a unique key.
3. Read the same key in JavaScript.

### Read by type

```js
this.token = Setting.string("token")       // text, select, symbol, or color
this.notify = Setting.bool("notify")       // toggle
this.fontSize = Setting.number("fontSize") // number; 0 when unset

const birthdayMs = Setting.date("birthday")
const birthday = new Date(birthdayMs)       // millisecond timestamp

this.background = Setting.image("background") // LL: path or ""
this.rules = Setting.fileString("rules")       // content of a picked text file
```

When unset, strings return `""`, booleans return `false`, and numbers and dates return `0`.

### Display an image selected by the user

```js
this.background = Setting.image("background")
```

Set the Image Type to File and Content to `${background}`. `Setting.image()` returns a local `LL:` path, not a network URL.

## Declare settings from JavaScript

When running in the editor, `Setting.add()` can place declarations in the settings panel's staging area:

```js
Setting.add({
  key: "city",
  name: "City",
  type: "text",
  icon: "location",
  description: "Enter the city used for weather"
})

Setting.add({
  key: "theme",
  name: "Theme",
  type: "select",
  options: ["light", "dark"]
})
```

| Field | Required | Description |
| --- | --- | --- |
| `key` | ✓ | Unique ID matching `Setting.xxx(key)` |
| `name` | ✓ | Label in the settings panel |
| `type` | ✓ | `text`, `toggle`, `select`, `icon`, `color`, or `file` |
| `icon` |  | SF Symbol name; defaults to `gearshape` |
| `description` |  | Explanatory text below the name |
| `options` | Required for `select` | Array of strings |

:::warning `Setting.add()` supports fewer types than the editor
You can create and read number, date, and image settings in the editor, but you can't currently declare them with `Setting.add()`.
:::

The same key updates the name, icon, description, and options while preserving the user's current value and original type. Removing a `Setting.add()` line only clears the staged declaration; it doesn't automatically delete an existing setting.

`Setting.add()` only works in the main app. Calling it from the widget extension doesn't modify settings.

## Write a setting value

`Setting.set(value, key)` writes a value back to a setting. One use is generating and saving an ID on the first run:

```js
if (!Setting.string("userId")) {
  Setting.set(String(Date.now()), "userId")
}
```

For most settings, it's clearer to let the user change the value in the settings panel.

## Quick reference

```js
Config.set(key, value)
Config.get(key, default?) → any
Config.has(key) → boolean
Config.delete(key)
Config.keys() → string[]

setConfig(key, value)      // legacy string storage
getConfig(key) → string

setValue(key, value)       // string stored by type + slot
getValue(key) → string

Setting.string(key) → string
Setting.bool(key) → boolean
Setting.number(key) → number
Setting.date(key) → number
Setting.image(key) → string
Setting.fileString(key) → string
Setting.set(value, key)
Setting.add({ key, name, type, ... })
```
