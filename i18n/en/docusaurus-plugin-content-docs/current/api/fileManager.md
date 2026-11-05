---
sidebar_position: 11
---

# File Manager

Use `FileManager` to store text, JSON, and images. Each widget has its own directory.

## Choose local or iCloud storage

| Initialization | Location | Recommended use |
| --- | --- | --- |
| `FileManager.local()` | Current device | Default choice; caches, images, ordinary data |
| `FileManager.iCloud()` | iCloud Drive | Files that need to be available across devices |

:::warning Prefer local files in widgets
An iCloud file may not be downloaded yet, and a background widget shouldn't wait for sync. Use `FileManager.local()` unless you specifically need a cross-device file.
:::

## Choose a public or private directory

```js
const fm = FileManager.local()
const publicDirectory = fm.documents()
const privateDirectory = fm.library()
```

| Method | Path prefix | Visible in the Files app |
| --- | --- | --- |
| `documents()` | Local `LD:` / iCloud `ID:` | Yes |
| `library()` | Local `LL:` / iCloud `IL:` | No |

The returned path already includes the current widget directory and a trailing `/`, so you can append a filename directly.

## Read and write text

```js
const fm = FileManager.local()
const path = fm.documents() + "greeting.txt"

const saved = fm.writeString(path, "Hello, Omni!")
const content = fm.readString(path)

console.log(saved, content)
```

`writeString()` returns whether the write succeeded. `readString()` returns an empty value when the file doesn't exist or can't be read.

## Save a remote image

```js
const fm = FileManager.local()
const path = fm.documents() + "background.png"

if (!fm.fileExists(path)) {
  const bytes = await new Request("https://example.com/image.png").fetch()
  fm.saveImage(path, bytes)
}

this.imagePath = path
```

Set the Image component's Type to File and Content to `${imagePath}`.

## Check and remove a file

```js
const fm = FileManager.local()
const path = fm.documents() + "temp.txt"

if (fm.fileExists(path)) {
  const removed = fm.remove(path)
  console.log("removed:", removed)
}
```

## List and clear a directory

```js
const fm = FileManager.local()
const cacheDirectory = fm.join([fm.documents(), "cache"])

fm.writeString(fm.join([cacheDirectory, "a.txt"]), "A")
fm.writeString(fm.join([cacheDirectory, "b.txt"]), "B")

const names = fm.listContents(cacheDirectory)
console.log(names) // ["a.txt", "b.txt"]

const cleared = fm.clear(cacheDirectory)
console.log(cleared, fm.listContents(cacheDirectory)) // true, []
```

`listContents()` returns the names of the directory's immediate children, including files and folders, sorted by name. `clear()` removes every file and subfolder inside the directory but keeps the directory itself.

:::warning Clearing can't be undone
Passing `fm.documents()` or `fm.library()` directly to `clear()` removes everything in that directory for the current widget. Check the path before you call it.
:::

## Join path components safely

```js
const path = fm.join([fm.documents(), "cache", "data.json"])
```

`join()` combines several path components and is useful when you have subdirectories. `./` segments and repeated `/` separators are normalized. Absolute paths, any `..` segment, and path prefixes belonging to another widget are rejected. Every file API uses the same path checks.

## iCloud directories

```js
const fm = FileManager.iCloud()
const publicDirectory = fm.documents() // ID:...
const privateDirectory = fm.library()  // IL:...
```

The public directory appears in iCloud Drive in the Files app. The private directory is for app use only.

## Quick reference

```js
FileManager.local() → FileManager
FileManager.iCloud() → FileManager
fm.documents() → string
fm.library() → string
fm.join(paths) → string
fm.fileExists(path) → boolean
fm.writeString(path, content) → boolean
fm.readString(path) → string | null
fm.saveImage(path, bytes) → void
fm.listContents(path) → string[]
fm.clear(path) → boolean
fm.remove(path) → boolean
```
