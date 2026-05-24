---
sidebar_position: 2
---

# Config Read / Write

Omni provides **3 kinds of storage**, each with a different scope:

| Type | Scope | Use Case |
|------|---------|------|
| Widget config (`Config`) | **Per-widget, isolated**, type-preserving | This widget's token, city, state objects, etc. |
| Common values (`getValue` / `setValue`) | **Shared across widgets** (same type + same slot) | Global user info; state changed inside button code |
| Settings (`Setting`) | **Per-widget** + filled in by user from the settings panel | After sharing a template, lets others fill in their own info |

## Widget Config

Each widget has its own isolated storage. **For new code, use `Config`** — it preserves types and supports defaults; see below.

The older `setConfig` / `getConfig` is the string-only flavor, kept around for:
- Interop with **Shortcuts** (Shortcuts can only pass strings)
- Not breaking older widgets

### `Config` (recommended)

`Config` is pre-initialized for each widget — just call it. It stores numbers / booleans / arrays / objects and gives them back as the same type.

```js
Config.set("count", 42)              // number
Config.set("on", true)               // boolean
Config.set("items", [1, 2, 3])       // array
Config.set("user", { name: "x" })    // object

Config.get("count")          // 42 (number, not "42")
Config.get("on")             // true (boolean, not 1)
Config.get("missing")        // undefined
```

#### Defaults — no more `??` fallbacks

`get`'s second argument is the fallback when the key is missing. Reading the call already tells you what the field defaults to:

```js
const idx  = Config.get("page",   0)              // → 0
const list = Config.get("recent", [])              // → []
const user = Config.get("user",   { name: "" })   // → empty object
```

#### Full signature

| Method | Notes |
|---|---|
| `Config.set(key, value)` | Stores any JSON-compatible value; `null` / `undefined` is equivalent to `delete` |
| `Config.get(key, default?)` | Reads; returns `default` if the key is missing or the value is corrupted (defaults to `undefined`) |
| `Config.has(key) → boolean` | Whether the key exists |
| `Config.delete(key)` | Removes |
| `Config.keys() → string[]` | Lists all keys, alphabetically sorted |

#### Things to know

:::tip Type fidelity
Internally JSON-serialized, so what you put in is what you get out — `true` stays `true`, `42` stays `42`, never coerced to `1` or `"42"`. Member types inside nested arrays / objects are preserved too.
:::

:::warning Doesn't share keys with `setConfig`
`Config` uses an isolated key prefix — even with the same key name, the two APIs are physically separated and won't see each other's data. To migrate, do it manually: `Config.set("token", getConfig("token"))`.
:::

### `setConfig` / `getConfig` (legacy, strings only)

```js
setConfig("token", "abcdef")    // write
const t = getConfig("token")    // read
console.log(t)                  // abcdef
```

Strings only. **For new code, just use `Config`**; migrating an existing widget over also means moving the data by hand (the two key sets don't overlap). **The one case where you still need this** is exchanging data with Shortcuts.

## Common Values

Storage keyed by "widget type + slot". If you add the same widget to your home screen **twice**, those become two slots (slot 1, slot 2), each isolated from the other.
When running inside the editor, the slot is always `999` (debug slot).

```js
setValue("database", "abcdefg")
const data = getValue("database")
console.log(data)
```

:::warning
The "slot" concept is decided by the system — moving your widget around on the home screen can cause slot changes. **Be careful** about using this for important data.
For everyday use, prefer `setConfig` / `getConfig`.
:::

## Settings (Setting)

If you want to **share** your widget with someone else but need them to fill in their own token / city / image — use Settings.

### Flow

1. **In the editor**: top-right ⚙️ → Add Setting, pick a type (text / number / date / toggle / select / icon / color / image / file), give it a key
2. **In your JS**: `Setting.string("xxx")` / `Setting.number("xxx")` etc. reads what the user filled in
3. **After import**, others see those settings in the widget's settings panel; once they fill them in, the widget works

> You can also **declare settings from JS** — see [Setting.add](#reverse-declaration-settingadd) below.

### Reading Settings

Each type has its own read function. If the user hasn't set a value, you get the type's default.

```js
// Text / select / icon / color hex — all strings
this.token   = Setting.string("token")     // "" if unset
this.theme   = Setting.string("theme")     // select also reads as string
this.icon    = Setting.string("iconName")  // SF Symbol name
this.color   = Setting.string("bgHex")     // e.g. "FF3000FF"

// Toggle
this.notify  = Setting.bool("notify")      // false if unset

// Number
this.size    = Setting.number("fontSize")  // Double, 0 if unset

// Date — returns a ms timestamp, plug straight into new Date()
const birthday = new Date(Setting.date("birthday"))
const daysOld  = (Date.now() - Setting.date("birthday")) / 86400000

// Image — returns an LL: path token, render via buttonStyle="file"
this.bgPath  = Setting.image("background") // "LL:{wid}/background.jpg" or ""

// File (picked by user from the system file picker) → file content as string
this.fileTxt = Setting.fileString("rules")
```

#### Rendering the image

`Setting.image()` returns an `LL:` prefixed path — **you can't drop it into `<img>` directly**. To render inside the widget, assign it to an image component's `value` and set `buttonStyle` to `"file"`:

```js
this.bgPath = Setting.image("background")  // "LL:{wid}/background.jpg"
```
Then in the editor's image component: `buttonStyle = "file"`, `value = "${bgPath}"`. The widget will pick up the file. On save, the image is **auto-compressed based on the image component's width**, so you don't need to worry about large photos eating memory.

### Reverse Declaration (Setting.add)

Don't want to manually add each setting in the editor? **Let JS declare them**. On each preview run, `Setting.add({...})` calls write into the settings panel's staging area; the user sees them the next time they open the panel.

```js
Setting.add({ key: "city",       name: "City",     icon: "location", type: "text" })
Setting.add({ key: "notify",     name: "Notify",   type: "toggle" })
Setting.add({ key: "fontSize",   name: "Font size", type: "number" })
Setting.add({ key: "birthday",   name: "Birthday", type: "date" })
Setting.add({ key: "background", name: "Background", type: "image" })
Setting.add({ key: "theme",      name: "Theme",    type: "select",
              options: ["dark", "light"] })
```

Fields:

| Field | Required | Notes |
|---|---|---|
| `key` | ✓ | Unique identifier; matches `Setting.xxx("key")` |
| `name` | ✓ | Label shown in the settings panel |
| `type` | ✓ | `text` / `number` / `date` / `toggle` / `select` / `icon` / `color` / `image` / `file` |
| `icon` | | SF Symbol name; defaults to `gearshape` |
| `description` | | Small gray hint shown below the name |
| `options` | required for `select` | array of strings |

**Merge rules:**
- key already exists → updates name / icon / description / options, **keeps the user's value and the original type**
- key doesn't exist → added
- If you remove a `Setting.add(...)` line in JS, the entry **disappears from staging on next preview**, but anything already merged into the panel isn't auto-deleted (user can delete manually)

**Main app only**: in the widget extension, `Setting.add` is a no-op, so it won't keep rewriting staging on every widget refresh.

### Writing Settings (Rare)

```js
Setting.set("uuid-12345", "userId")        // write a string
const id = Setting.string("userId")
console.log(id)
```

Typical use: on first run, generate a unique ID and store it for next time.

## Quick Reference

```js
// Widget-level — simple strings
setConfig(key, value)        // write
getConfig(key) → string      // read

// Widget-level — type-preserving KV
Config.set(key, value)               // write any JSON-compatible value
Config.get(key, default?) → any      // read; returns default if missing
Config.has(key) → boolean
Config.delete(key)
Config.keys() → string[]

// Common (by type + slot)
setValue(key, value)         // write
getValue(key) → string       // read

// User-filled settings — read
Setting.string(key)     → string  // text/select/icon/color hex
Setting.bool(key)       → bool
Setting.number(key)     → Double  // 0 if unset
Setting.date(key)       → Number  // ms timestamp, 0 if unset
Setting.image(key)      → string  // "LL:{wid}/file.jpg", "" if unset
Setting.fileString(key) → string  // file content

// User-filled settings — write
Setting.set(value, key)           // string only
Setting.add({ key, name, type, ... })  // JS reverse declaration (App only)
```
