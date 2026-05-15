---
sidebar_position: 2
---

# Image

Displays an image. **The key property is "type"** — it decides where the image comes from.

## Type (must read)

Image has two types, switchable in the property panel. They behave completely differently:

| Type | Meaning | What goes in the content field |
|------|---------|--------------------------------|
| **Photo** (default) | Pick a photo from the system **Photo Library**; Omni saves a copy inside the app | A UUID (auto-generated when you pick a photo — you don't fill it in) |
| **File** | Use a local **file path**, typically an image downloaded by JS | A file path like `LD:.../xxx.png`, `LL:.../xxx.png`, or the placeholder `{path}` |

:::warning You can't pass a URL directly
The image component **does not fetch from the network on its own**. No matter the type, **putting `https://...` in there shows nothing**.
To display a remote image, **first download it in JS and save it locally, then use the "File" type with that path**. Example below.
:::

## "Photo" type usage

1. Add an image component
2. Keep the type as default ("Photo")
3. In the property panel, find **➕ Add image** — the system photo picker pops up
4. After picking, a crop UI appears; crop and save
5. The content field is auto-filled with a UUID — leave it alone

Good for **fixed wallpapers / decoration** — pick once and you're done.

## "File" type usage

1. Add an image component
2. Switch type to "File"
3. In the content field, enter a **file path** (examples below)

Path prefixes:

| Prefix | Meaning | From |
|--------|---------|------|
| `LD:` | Local public directory (visible in the Files app) | `FileManager.local().documents()` |
| `LL:` | Local private directory | `FileManager.local().library()` |
| `ID:` | iCloud public directory | `FileManager.iCloud().documents()` |
| `IL:` | iCloud private directory | `FileManager.iCloud().library()` |

Full path rules in [File Manager](../api/fileManager.md).

## Example: fetch a remote image (with local cache)

Download once; subsequent runs use the local copy with no re-download:

```js
const fm = FileManager.local()
const path = fm.documents() + "avatar.png"

if (!fm.fileExists(path)) {
  const data = await new Request("https://example.com/avatar.png").fetch()
  fm.saveImage(path, data)
}

this.img = path   // path looks like "LD:widgetId/avatar.png"
```

Image component:

- Type: **File**
- Content: `{img}`

After the first run, every refresh skips the download — **rendering is super fast** (local IO, no network).

:::tip When do you re-download?
For images that rarely change (avatars, logos), the "fetch once and reuse" pattern above is ideal.

For images that change (daily covers, dynamic posters), let the cache **expire by time** by including a date in the filename.
iOS will reclaim old files on its own during system cleanup — no manual deletion needed.

```js
const today = new Date().toISOString().slice(0, 10)  // "2026-05-02"
const path = fm.documents() + `cover-${today}.png`
if (!fm.fileExists(path)) {
  const data = await new Request("https://example.com/cover.png").fetch()
  fm.saveImage(path, data)
}
this.img = path
```
:::



## Common properties

| Property | Description |
|----------|-------------|
| Type | Photo / File — see above |
| Content | UUID (auto-filled for Photo) or file path (for File) |
| Width / Height | Display size |
| Scale mode | `fit` (preserve aspect, fully visible) / `fill` (fill and crop) / `stretch` |
| Clip shape | Rectangle / RoundedRectangle / Circle / Capsule / Ellipse |
| Corner radius | Only effective for RoundedRectangle |
| Rotation / Offset / Opacity | Visual tweaks |
