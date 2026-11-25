---
sidebar_position: 2
---

# 图片 Image

Image 可以显示从照片中选择或用相机拍摄的固定图片，也可以显示 JavaScript 下载到本地的图片。先选对“类型”，再填写内容。

## 先选图片类型

| 类型 | 适合场景 | 内容是什么 |
| --- | --- | --- |
| **照片** | 固定壁纸、头像、装饰图 | 选图后自动生成的 UUID，不需要手填 |
| **文件** | 网络图片、动态封面、本地缓存 | `LD:`、`LL:`、`ID:`、`IL:` 路径或路径占位符 |

:::warning 不能直接填写网络 URL
Image 不会自动下载 `https://...` 图片。请先用 JavaScript 下载并保存，再把组件类型设为“文件”。
:::

## 选择或拍摄照片

1. 添加 **image**。
2. 保持类型为“照片”。
3. 点属性面板中的“加图”，选择“从照片中选择”或“拍照”。
4. 需要调整画面时，点编辑按钮进入裁剪器。
5. 保存。内容里的 UUID 由 Omni 管理，不要修改。

## 显示本地文件

1. 添加 **image**。
2. 把类型改为“文件”。
3. 在内容里填写文件路径或占位符。

| 前缀 | 位置 | 获取方式 |
| --- | --- | --- |
| `LD:` | 本地公共目录，可在“文件”App 中查看 | `FileManager.local().documents()` |
| `LL:` | 本地私有目录 | `FileManager.local().library()` |
| `ID:` | iCloud 公共目录 | `FileManager.iCloud().documents()` |
| `IL:` | iCloud 私有目录 | `FileManager.iCloud().library()` |

完整规则见[文件管理](../api/fileManager.md)。

## 适配深色模式

Image 可以分别设置浅色图片和深色图片。系统切换外观时会自动选择对应图片；没有设置深色图片时，深色模式继续显示浅色图片。

- **照片**：可以从照片中选择或直接拍摄，再分别裁剪浅色图片、深色图片。清除深色图片后会恢复为“跟随浅色图片”。
- **文件**：在“内容”与“深色图片”中分别填写路径或占位符。

```js
this.lightImage = FileManager.local().documents() + "cover-light.png"
this.darkImage = FileManager.local().documents() + "cover-dark.png"
```

Image 设置：

- 类型：**文件**
- 内容：`${lightImage}`
- 深色图片：`${darkImage}`

两张图片使用同一组宽高、缩放模式和裁剪形状，因此切换外观时不会改变组件布局。

## 示例：下载并缓存网络图片

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

Image 设置：

- 类型：**文件**
- 内容：`${imagePath}`

首次运行会下载图片，之后直接读取本地文件。

### 缓存会变化的图片

如果图片每天更新，可以把日期放进文件名：

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

这种写法会产生多个缓存文件。需要严格控制空间时，请用 `fm.remove(path)` 删除不再使用的旧文件。

## 常用属性

| 属性 | 作用 |
| --- | --- |
| 类型 | 照片或文件 |
| 内容 | 浅色或默认模式使用的照片 UUID / 文件路径 |
| 深色图片 | 深色模式使用的照片 UUID / 文件路径；留空时跟随浅色图片 |
| 宽 / 高 | 图片显示尺寸 |
| 缩放模式 | `fit` 完整显示；`fill` 填满并裁剪；`stretch` 拉伸 |
| 裁剪形状 | 矩形、圆角矩形、圆形、胶囊或椭圆 |
| 圆角 | 仅对圆角矩形生效；可以统一调整，也可以分别设置四个角 |
| 旋转 / 偏移 / 不透明度 | 调整视觉效果 |
| Blend Mode | 与下方内容混合；详见[视觉效果](./visual-effects.md#blend-mode) |
| Blur / Scale Effect | 模糊、缩放或镜像图片；详见[视觉效果](./visual-effects.md) |

选择“圆角矩形”作为裁剪形状后，点圆角右侧的编辑按钮，可以分别设置左上、右上、左下和右下圆角。直接使用加减按钮时，四个角会一起变化。

四个角都可以通过变量按钮绑定 `${变量名}`。变量需要解析为数值；不是有效数字或小于 `0` 时按 `0` 处理。绑定变量后，统一加减按钮会暂时禁用。
