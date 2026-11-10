---
sidebar_position: 2
---

# Image

Image can display a fixed photo from your library or a file downloaded by JavaScript. Choose the right Type before setting Content.

## Choose an image type first

| Type | Best for | What Content contains |
| --- | --- | --- |
| **Photo** | Fixed wallpapers, avatars, and decoration | A UUID generated after you pick the image; don't enter it yourself |
| **File** | Remote images, changing covers, and local caches | An `LD:`, `LL:`, `ID:`, or `IL:` path, or a path placeholder |

:::warning A network URL won't work directly
Image doesn't download `https://...` on its own. Download and save the image with JavaScript first, then set Type to File.
:::

## Display a photo from the library

1. Add **image**.
2. Keep Type set to Photo.
3. Tap Add Image in the property panel, then choose and crop a photo.
4. Save. Omni manages the UUID in Content; don't edit it.

## Display a local file

1. Add **image**.
2. Change Type to File.
3. Enter a file path or placeholder in Content.

| Prefix | Location | How to get it |
| --- | --- | --- |
| `LD:` | Local public directory, visible in Files | `FileManager.local().documents()` |
| `LL:` | Local private directory | `FileManager.local().library()` |
| `ID:` | iCloud public directory | `FileManager.iCloud().documents()` |
| `IL:` | iCloud private directory | `FileManager.iCloud().library()` |

See [File Manager](../api/fileManager.md) for the full rules.

## Adapt to Dark Mode

Image can use separate light and dark images. It switches automatically with the system appearance. If you don't set a dark image, Dark Mode continues to use the light image.

- **Photo**: Pick and crop the light and dark photos separately. Clear the dark photo to return to Follow Light Image.
- **File**: Enter separate paths or placeholders in Content and Dark Image.

```js
this.lightImage = FileManager.local().documents() + "cover-light.png"
this.darkImage = FileManager.local().documents() + "cover-dark.png"
```

Image setup:

- Type: **File**
- Content: `${lightImage}`
- Dark Image: `${darkImage}`

Both images share the same width, height, scale mode, and clip shape, so switching appearance doesn't change the component layout.

## Example: download and cache a remote image

```js
const fm = FileManager.local()
const path = fm.documents() + "avatar.png"

if (!fm.fileExists(path)) {
  const request = new Request("https://example.com/avatar.png")
  request.headers = {
    "Authorization": `Bearer ${token}`
  }
  await fm.download(request, path)
}

this.imagePath = path
```

Image setup:

- Type: **File**
- Content: `${imagePath}`

The first run downloads the image. Later runs read the local file.

### Cache an image that changes

For a daily image, include the date in its filename:

```js
const fm = FileManager.local()
const day = new Date().toISOString().slice(0, 10)
const path = fm.documents() + `cover-${day}.png`

if (!fm.fileExists(path)) {
  const request = new Request("https://example.com/cover.png")
  await fm.download(request, path)
}

this.imagePath = path
```

This creates several cache files over time. If you need strict space control, remove files you no longer use with `fm.remove(path)`.

## Common properties

| Property | What it does |
| --- | --- |
| Type | Photo or File |
| Content | Photo UUID or file path used in Light Mode and as the default |
| Dark Image | Photo UUID or file path used in Dark Mode; leave it empty to follow the light image |
| Width / Height | Display size |
| Scale mode | `fit` shows the whole image; `fill` fills and crops; `stretch` distorts to fit |
| Clip shape | Rectangle, rounded rectangle, circle, capsule, or ellipse |
| Corner radius | Applies only to a rounded rectangle |
| Rotation / Offset / Opacity | Changes the visual treatment |
| Blend Mode | Mixes the image with content below it; see [Visual effects](./visual-effects.md#blend-mode) |
| Blur / Scale Effect | Blurs, scales, or flips the image; see [Visual effects](./visual-effects.md) |
