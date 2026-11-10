---
sidebar_position: 2
---

# 做出第一个小组件

这份教程会带你完成一个显示当前天气的中号小组件。预计用时：10 分钟。

完成后，它会显示：

- 当前天气图标
- 天气状况
- 当前温度

## 1. 新建一个中号小组件

打开 Omni，在首页右上角点 `+`，选择**中号**，输入名称后进入编辑器。

:::tip 编辑器会适应窗口宽度
Omni 需要 iOS 17 或更高版本。宽屏时，预览在左侧，组件和属性在右侧；拖动分隔线可以调整两栏，双击分隔线会恢复系统比例。窄屏时，编辑面板位于预览下方，可以拖动顶部把手或收起后再用编辑按钮打开。调整面板不会移动预览。你可以单指移动预览、双指缩放，或双击恢复位置和大小。代码在宽屏中显示于右栏，在窄屏中以大尺寸面板打开。旋转设备或调整分屏宽度时，当前页面、源码和撤销记录都会保留。
:::

## 2. 添加三个组件

点编辑器右上角的 `+`，按顺序添加：

1. `vstack`：作为竖排容器。
2. `icon`：放在 `vstack` 里，显示天气图标。
3. 两个 `text`：分别显示天气状况和温度。

组件树应当是：

```text
vstack
├─ icon
├─ text
└─ text
```

先不用调整样式。确认结构正确后继续。

## 3. 获取天气数据

点代码按钮，打开 JavaScript 编辑器，粘贴下面的代码：

```js
try {
  const weather = await Weather.current()

  this.icon = weather.symbolName
  this.condition = weather.condition
  this.temperature = Math.trunc(weather.temperature.value)
} catch (error) {
  this.icon = "exclamationmark.triangle.fill"
  this.condition = "暂时无法获取天气"
  this.temperature = "--"
  console.error(error)
}
```

点**运行**。只要控制台没有报错，数据就已经准备好了。

:::tip 第一次运行会请求权限
天气依赖位置。系统弹出位置权限时，请允许 Omni 获取位置；否则天气接口会失败。
:::

### 用 VS Code 编辑（可选）

需要电脑联调时，再点 JavaScript 编辑器右上角的电脑按钮开启同步。关闭代码编辑器会断开连接，重新打开后需要再次手动开启。

## 4. 把数据放进组件

回到组件编辑页，依次填写“内容”：

| 组件 | 内容 |
| --- | --- |
| icon | `${icon}` |
| 第一个 text | `${condition}` |
| 第二个 text | `${temperature}°` |

`${temperature}` 会被 JavaScript 里的 `this.temperature` 替换。预览现在应该已经显示当前天气。

如果内容是空白，回到代码编辑器重新运行，并在控制台检查错误。更多写法见[占位符语法](./placeholder.md)。

## 5. 建议下次刷新时间

在 JavaScript 最后加一行：

```js
setUpdateFreq(30) // 建议系统 30 分钟后刷新
```

这是给 iOS 的建议，不保证精确到 30 分钟。详见[组件控制](../api/control.md)。

## 6. 保存并添加到主屏幕

1. 在编辑器右上角点**保存**。
2. 回到主屏幕，长按空白处，添加 **Omni 中号**小组件。
3. 长按刚添加的小组件，点**编辑小组件**。
4. 选择你刚才保存的小组件。

完成。接下来可以调整字体、颜色、间距和背景，让它更像你自己的作品。

## 接下来读什么？

- [占位符语法](./placeholder.md)：显示对象字段和数组数据。
- [容器 Stack](../components/stack.md)：掌握常用布局。
- [循环 Loop](../components/loop.md)：用一套布局显示多条数据。
- [JavaScript 接口](../api/network.md)：联网并读取更多系统数据。
