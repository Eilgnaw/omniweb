---
sidebar_position: 2
---

# 图片 Image

显示一张图。**关键属性是"类型"** — 它决定图从哪里来。

## 类型(必看)

image 有两种类型,在属性面板里切换,行为完全不一样:

| 类型 | 含义 | 内容字段填什么 |
|------|------|---------------|
| **照片** (默认) | 从系统**相册**里选一张图,Omni 帮你存到 App 里 | 一个 UUID(由相册选图时自动生成,不用手填) |
| **文件** | 用本地**文件路径**指定一张图,通常是 JS 从网络下载下来的 | 文件路径,如 `LD:.../xxx.png`、`LL:.../xxx.png`、或 `{path}` 占位符 |

:::warning 不能直接填 URL
image 组件**不会自己发起网络请求**。不管选哪种类型,**写 `https://...` 都不会显示**。
要展示网络图,**必须先用 JS 把图下载下来保存到本地,然后走"文件"类型 + 路径**。看下面例子。
:::

## "照片"类型用法

1. 添加 image 组件
2. 类型保持默认("照片")
3. 在属性面板找到 **➕ 加图**,弹出系统相册选一张
4. 选中后会自动进入裁剪界面,裁完保存
5. 内容字段会被自动填成一个 UUID,你不用管它

适合**固定壁纸 / 装饰**类需求,选完就完事。

## "文件"类型用法

1. 添加 image 组件
2. 类型切到"文件"
3. 在内容字段填**文件路径**(下面有示例)

路径前缀:

| 前缀 | 含义 | 来自 |
|------|------|------|
| `LD:` | 本地公共目录(在"文件 App"里能看到) | `FileManager.local().documents()` |
| `LL:` | 本地私有目录 | `FileManager.local().library()` |
| `ID:` | iCloud 公共目录 | `FileManager.iCloud().documents()` |
| `IL:` | iCloud 私有目录 | `FileManager.iCloud().library()` |

详细路径规则见 [文件管理](../api/fileManager.md)。

## 例:从网络拉图显示(带本地缓存)

第一次拉,之后直接用本地缓存,不再重复下载:

```js
const fm = FileManager.local()
const path = fm.documents() + "avatar.png"

if (!fm.fileExists(path)) {
  const data = await new Request("https://example.com/avatar.png").fetch()
  fm.saveImage(path, data)
}

this.img = path   // path 形如 "LD:小组件id/avatar.png"
```

image 组件:

- 类型:**文件**
- 内容:`{img}`

后续每次刷新都跳过下载,**渲染极快**(本地 IO,不走网络)。

:::tip 什么时候要重新下载?
头像、Logo 这类基本不变的图,上面这种"存了就不再拉"的写法最佳。

如果是会变的图(每天更新的封面、动态海报),让缓存**按时效失效**:把文件名加上日期。
旧的文件 iOS 会在系统清理时自动回收,不用你手动删。

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



## 常用属性

| 属性 | 说明 |
|------|------|
| 类型 | 照片 / 文件,详见上文 |
| 内容 | UUID(照片类型自动填) 或 文件路径(文件类型) |
| 宽 / 高 | 显示尺寸 |
| 缩放模式 | `fit` 等比完整显示 / `fill` 填满裁剪 / `stretch` 拉伸 |
| 裁剪形状 | Rectangle / RoundedRectangle / Circle / Capsule / Ellipse |
| 圆角 | 仅 RoundedRectangle 形状有效 |
| 旋转 / 偏移 / 透明度 | 视觉调整 |
