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

If you want to **share** your widget with someone else but need them to fill in their own token / city / file — use Settings.

### Flow

1. **In the editor**: bottom-left ⚙️ → Add Setting, pick a type (string / file / option / toggle), give it a key
2. **In your JS**: `Setting.string("xxx")` reads the value the user filled in
3. **After import**, others see those settings in the widget's settings panel; once they fill them in, the widget works

### Reading Settings

```js
this.token   = Setting.string("token")     // string
this.flag    = Setting.bool("notify")      // toggle
this.choice  = Setting.string("city")      // option (also a string)
this.fileTxt = Setting.fileString("rules") // file → file content
```

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

// User-filled settings
Setting.string(key) → string
Setting.bool(key)   → bool
Setting.fileString(key) → string  // file content
Setting.set(value, key)           // string only
```
