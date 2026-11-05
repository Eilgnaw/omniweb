---
sidebar_position: 1
---

# 基础概念

开始制作前，先认识卡片形态、布局、数据和刷新方式。

## 1. 先选卡片形态

| 位置 | 形态 | 尺寸 |
| --- | --- | --- |
| 主屏幕 | 桌面 `desk` | `1*2`、`2*2`、`2*4`、`4*4` |
| 锁屏 | 锁屏 `lock` | `lock_1*1`、`lock_1*2` |

新建时先按使用位置和内容量选择。桌面卡片适合天气、日程和信息面板；锁屏卡片空间更小，适合图标、数字和短状态。

## 2. 布局决定外观，JS 提供数据

一张动态卡片由三部分组成：

1. **组件**：文字、图片、图标和容器负责显示。
2. **JavaScript**：获取数据，并在顶层声明输出变量。
3. **占位符**：用 `${变量名}` 把变量放进组件字段。

```js
const request = new Request("https://2f0.cn/api/omni")
const data = await request.fetchJSON()

let title = data.omni
let count = 12
```

在文字组件的“内容”中填写：

```text
${title}
```

## 3. 哪些变量能显示？

Omni 会收集顶层的 `const`、`let` 和 `var`：

```js
const title = "今日天气"   // 可以使用 ${title}
let count = 3             // 可以使用 ${count}
const _token = "secret"   // _ 开头，不输出

function load() {
  const temp = 26         // 函数局部变量，不输出
}
```

:::warning 不要自己写顶层 `return`
Omni 会自动收集顶层变量并返回结果。你只需要写普通脚本。
:::

## 4. 选对布局组件

| 想要的效果 | 使用 |
| --- | --- |
| 从上到下排列 | 纵列 |
| 从左到右排列 | 横排 |
| 前后叠放 | 层叠 |
| 固定行列 | 网格 |
| 可滚动长内容 | 列表 |
| 把前后内容推向两端 | 占位 |
| 按数组重复一套布局 | 容器的“数据源（循环）” |

## 5. JavaScript 运行环境

- 支持标准 JavaScript、`async/await`、`Promise`、`Date`、`JSON` 和 `Math`。
- 使用 Omni 的 `Request`，没有浏览器 `fetch`、`window` 或 `document`。
- 不能安装 npm 包。
- 卡片刷新中的脚本最多运行 4.5 秒；超时会保留上一次成功内容。

## 6. 刷新由系统调度

`setUpdateFreq(30)` 可以建议系统 30 分钟后刷新，但不是精确定时器。时钟和计时器应使用对应组件，不要依赖频繁运行 JavaScript。

## 7. 分享前，把个人值做成设置项

需要用户填写城市、Token、颜色或图片时，使用 `Setting.add()` 声明设置项，再用 `Setting.string()`、`Setting.number()` 等方法读取。详见[配置与设置](../api/config.md)。

---

下一步：[做出第一个卡片 →](./first-widget.md)
