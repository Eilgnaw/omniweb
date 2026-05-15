---
sidebar_position: 11
---
# File Manager
:::info
The FileManager module gives Omni widgets the ability to read and write files, with support for both iCloud and local storage.
:::

## Initialization

`FileManager` needs to be initialized first to specify whether to use local or iCloud storage.

### Local Storage

Files are stored only on the current device.

#### Public Directory

Files are stored under `Files App -> On My iPhone -> Omni`.

```javascript
// Initialize a local FileManager
const fm = FileManager.local();

// Get the public documents directory path
const documentsPath = fm.documents();
console.log(documentsPath);
// Outputs LD:widgetID(UUID)/
// Corresponds to: iPhone/OmniWidgets/Widgets/widgetID(UUID)
```

#### Private Directory

Files are stored in the app's internal local directory, not visible in the Files app.

```javascript
// Initialize a local FileManager
const fm = FileManager.local();

// Get the private library directory path
const libraryPath = fm.library();
console.log(libraryPath);
```


## File Operations

### Read / Write Strings

For text files like `txt`, `json`, etc.

```javascript
const fm = FileManager.local();
const docs = fm.documents();
const filePath = docs + "greeting.txt";

// Write a string
fm.writeString(filePath, "Hello, Omni!");

// Read a string
const content = fm.readString(filePath);
console.log(content); // Outputs: Hello, Omni!
```

### Read / Write Images

For saving and loading images.

```javascript
const fm = FileManager.local();
const docs = fm.documents();
this.imagePath = docs + "background.png";
// Assume `image` is image data fetched from the network or elsewhere [Uint8Array]
const image = await new Request("https://example.com/image.png").fetch();
// Save the image
fm.saveImage(imagePath, image);

// Display in an image component
// Set the image component type to "File" and fill in the imagePath variable as the content.
```

### Check If a File Exists

```javascript
const fm = FileManager.local();
const path = fm.documents() + "config.json";

if (fm.fileExists(path)) {
  console.log("File exists");
} else {
  console.log("File does not exist");
}
```

### Delete a File

```javascript
const fm = FileManager.local();
const path = fm.documents() + "temp.txt";

// Make sure the file exists before deleting
if (fm.fileExists(path)) {
  fm.remove(path);
  console.log("File deleted");
}
```

## Shortcuts

You can find more file operation examples and shortcuts under `Shortcuts App -> Omni -> File Management`.


## iCloud Drive
:::tip
Since widgets themselves don't currently support iCloud sync, iCloud is not recommended for now.
:::
Files are stored in iCloud Drive and sync across multiple devices.

#### Public Directory

Files are stored under `Files App -> iCloud Drive -> Omni`, where users can easily browse and manage them.

```javascript
// Initialize an iCloud FileManager
const fm = FileManager.iCloud();

// Get the public documents directory path
const documentsPath = fm.documents();
console.log(documentsPath);
// Outputs ID:widgetID(UUID)/
// Corresponds to: iCloud/OmniWidgets/Widgets/widgetID(UUID)
```

#### Private Directory

Files are stored in the app's internal iCloud directory, not visible in the Files app. Good for cache or config files you don't want users touching directly.

```javascript
// Initialize an iCloud FileManager
const fm = FileManager.iCloud();

// Get the private library directory path
const libraryPath = fm.library();
console.log(libraryPath);
```
