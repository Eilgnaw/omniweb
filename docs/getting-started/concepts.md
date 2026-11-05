---
sidebar_position: 1
---

# 基础概念

开始制作前，先认识小组件的类型、布局、数据和刷新方式。

## 1. 先选小组件类型

不同类型出现的位置和尺寸不同。新建时先按使用场景选择：

| 位置 | 类型 | 适合展示 |
| --- | --- | --- |
| 主屏幕 | 小 / 中 / 大 | 天气、照片、日程、信息面板 |
| 锁屏 | 圆形 / 矩形 / 内联 | 一眼能读完的状态或数字 |
| 控制中心 | 按钮 / 开关 | 触发操作或切换状态 |
| 灵动岛与锁屏 | 实时活动 | 比赛、计时、配送等持续进度 |

系统会限制不同位置的颜色、交互和刷新能力。例如，锁屏组件通常使用单色显示。

## 2. 布局决定外观，JS 提供数据

一个动态小组件由三部分组成：

1. **组件**：`text`、`image`、`icon` 等，负责显示内容。
2. **JavaScript**：联网或读取系统数据，把结果写到变量。
3. **占位符**：用 `${变量名}` 把变量放进组件属性。

下面是完整的数据流：

```js
const req = new Request("https://2f0.cn/api/omni")
const data = await req.fetchJSON()
this.title = data.omni
```

然后在 text 组件的“内容”里填写：

```text
${title}
```

组件最终会显示 `data.omni` 的值。

:::tip 哪些变量能用于占位符？
最清楚的写法是把输出放到 `this.xxx`。顶层声明的 `let`、`var`、`const` 也会成为输出；名称以 `_` 开头时会被忽略。函数内部的局部变量不会输出。

```js
this.title = "今日天气"       // 可以用 ${title}
const count = 3              // 可以用 ${count}
const _token = "secret"      // 不会输出

function load() {
  const temp = 26            // 局部变量，不会输出
}
```
:::

## 3. 选对布局组件

| 想要的效果 | 使用 |
| --- | --- |
| 从上到下排列 | `vstack` |
| 从左到右排列 | `hstack` |
| 前后叠放 | `zstack` |
| 一段文字里混合字号或颜色 | `tstack` |
| 固定列数并自动换行 | `grid` |
| 按数组重复一套布局 | 容器的循环数据源 |

先从 [Stack 容器](../components/stack.md)开始；要展示列表，再看[循环](../components/loop.md)。

## 4. JavaScript 运行环境

- 支持标准 JavaScript、`async/await`、`Promise`、`Date`、`JSON` 和 `Intl`。
- 没有 `window`、`document` 和浏览器 `fetch`；网络请求使用 Omni 的 [`Request`](../api/network.md)。
- 不能安装 npm 包，只能使用标准 JavaScript 和 Omni 内置接口。
- 小组件扩展的内存有限，不要一次加载大图片、大文件或完整网页。

## 5. 刷新时间由 iOS 决定

`setUpdateFreq(30)` 可以建议系统 30 分钟后刷新，但不是定时器。实际时间由 iOS 根据使用频率、电量和系统资源安排。

:::warning
不要用普通小组件做秒级刷新。倒计时请用 [Date 组件](../components/date.md)，持续状态请用实时活动。
:::

## 6. 分享前，把个人信息做成设置项

需要用户填写城市、Token、颜色或图片时，不要把值写死在代码里。创建设置项，再用 `Setting` 读取。详见[配置与设置](../api/config.md)。

---

下一步：[做出第一个小组件 →](./first-widget.md)
