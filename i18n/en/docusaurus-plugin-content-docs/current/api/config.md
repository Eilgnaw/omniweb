---
sidebar_position: 2
---

# Config Read / Write

Omni provides **3 kinds of storage**, each with a different scope:

| Type | Scope | Use Case |
|------|---------|------|
| Widget config (`getConfig` / `setConfig`) | **Per-widget, isolated** | This widget's token, city, etc. |
| Common values (`getValue` / `setValue`) | **Shared across widgets** (same type + same slot) | Global user info; state changed inside button code |
| Settings (`Setting`) | **Per-widget** + filled in by user from the settings panel | After sharing a template, lets others fill in their own info |

## Widget Config

Each widget has its own isolated storage.

```js
setConfig("token", "abcdef")    // write
const t = getConfig("token")    // read
console.log(t)                  // abcdef
```

Also readable / writable from **Shortcuts**, which is great for pushing data from Shortcuts into the widget.

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
// Widget-level
setConfig(key, value)        // write
getConfig(key) → string      // read

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
