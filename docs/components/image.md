---
sidebar_position: 2
---

# 图片 Image

Image 可以显示相册里的固定图片，也可以显示 JavaScript 下载到本地的图片。先选对“类型”，再填写内容。

## 先选图片类型

| 类型 | 适合场景 | 内容是什么 |
| --- | --- | --- |
| **照片** | 固定壁纸、头像、装饰图 | 选图后自动生成的 UUID，不需要手填 |
| **文件** | 网络图片、动态封面、本地缓存 | `LD:`、`LL:`、`ID:`、`IL:` 路径或路径占位符 |

:::warning 不能直接填写网络 URL
Image 不会自动下载 `https://...` 图片。请先用 JavaScript 下载并保存，再把组件类型设为“文件”。
:::

## 显示相册图片

1. 添加 **image**。
2. 保持类型为“照片”。
3. 点属性面板中的“加图”，选择并裁剪图片。
4. 保存。内容里的 UUID 由 Omni 管理，不要修改。

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

## 示例：下载并缓存网络图片

```js
const fm = FileManager.local()
const path = fm.documents() + "avatar.png"

if (!fm.fileExists(path)) {
  const data = await new Request("https://example.com/avatar.png").fetch()
  fm.saveImage(path, data)
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
  const data = await new Request("https://example.com/cover.png").fetch()
  fm.saveImage(path, data)
}

this.imagePath = path
```

这种写法会产生多个缓存文件。需要严格控制空间时，请用 `fm.remove(path)` 删除不再使用的旧文件。

## 常用属性

| 属性 | 作用 |
| --- | --- |
| 类型 | 照片或文件 |
| 内容 | 照片 UUID 或文件路径 |
| 宽 / 高 | 图片显示尺寸 |
| 缩放模式 | `fit` 完整显示；`fill` 填满并裁剪；`stretch` 拉伸 |
| 裁剪形状 | 矩形、圆角矩形、圆形、胶囊或椭圆 |
| 圆角 | 仅对圆角矩形生效 |
| 旋转 / 偏移 / 不透明度 | 调整视觉效果 |
| Blur / Scale Effect | 模糊、缩放或镜像图片；详见[视觉效果](./visual-effects.md) |
