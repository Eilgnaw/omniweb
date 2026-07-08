---
sidebar_position: 2
---

# 图片

图片用来显示网络图片、本地沙盒图片,也可以通过占位符动态切换。

## 用法

在编辑器底部点加号,添加 **图片**,然后在「资源」字段填图片来源。

| 资源填写 | 来源 |
|---|---|
| `https://example.com/x.png` | 网络图片 |
| `files/avatar.png` | 沙盒文件,见 [`FileManager`](../api/fileManager.md) |
| `${img}` | JS 顶层变量,值可以是上面任一种 |

## 属性

| 字段 | 可填写 | 说明 |
|------|------|------|
| 资源 | `https://...` / `files/a.png` / `${img}` | 图片路径 |
| 填充模式 | `fit` / `fill` / `cover` / `contain` / `none` / `scaleDown` | 控制图片如何适配宽高 |
| 宽 / 高 | `48` / `100%` / `${size}` | 图片尺寸 |
| 水平偏移 / 垂直偏移 / Z 轴偏移 | `0` / `8` / `${x}` | 只移动显示位置,不改变原本占位 |
| 内边距 / 外边距 | `8` / `8,8,8,8` | 四周留白 |
| 显示 | `true` / `false` / `${show}` | 控制是否显示 |
| 背景色 | `#FFFFFF` / `${color}` | 图片背景 |
| 圆角 | `0` / `8` / `50%` | 裁掉超出圆角的部分 |
| 旋转角度 | `0` / `15` / `${angle}` | 顺时针旋转角度 |
| 不透明度 | `0` 到 `1` | `1` 为完全不透明 |

## 例:下载并展示

```js
const url = "https://example.com/today.png"
let img = "files/today.png"

if (!(await FileManager.exists("today.png"))) {
  try {
    const bytes = await new Request(url).fetch()
    img = await FileManager.write("today.png", bytes)
  } catch (e) {
    console.error("图片下载失败:", e.message)
    img = ""
  }
}
```

图片的「资源」字段填 `${img}`。

## 例:动态切图

```js
let img = Device.locale.startsWith("zh")
  ? "files/banner_zh.png"
  : "files/banner_en.png"
```

## 注意事项

:::warning 本地图片必须带 `files/` 前缀
卡片侧显示本地图片靠 `files/` 前缀识别。省掉前缀直接写 `"x.png"` 会显示不出来。`FileManager.write` 返回的就是正确形式。
:::

:::tip 资源解析顺序
「资源」字段先解析占位符,再按 `https://` 或 `files/` 前缀决定加载方式。混排 URL 也支持,只看最终字符串的开头。
:::

:::warning 不要在卡片刷新时下载大图
卡片刷新有时间上限。大图建议先在 App 里运行一次缓存好,卡片刷新时直接使用 `files/` 路径。
:::
