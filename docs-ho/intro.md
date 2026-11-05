---
sidebar_position: 1
---

# Omni Widgets 鸿蒙版文档

Omni Widgets 让你用可视化编辑器制作鸿蒙桌面卡片和锁屏卡片。先摆好文字、图片与容器；需要动态数据时，再加一段 JavaScript。

:::warning 文档跟随最新测试版
部分组件或 API 可能尚未出现在你当前安装的版本中。如需体验最新能力，可在 App 的“联系我们”中加入测试。
:::

:::tip 第一次使用？
直接跟着[做出第一个卡片](./getting-started/first-widget.md)操作。大约 10 分钟，你会完成一张可以自动更新数据的桌面卡片。
:::

## 你想完成什么？

| 目标 | 从这里开始 |
| --- | --- |
| 第一次制作卡片 | [做出第一个卡片](./getting-started/first-widget.md) |
| 了解布局、数据与刷新 | [基础概念](./getting-started/concepts.md) |
| 把 JavaScript 数据显示到组件上 | [占位符语法](./getting-started/placeholder.md) |
| 添加卡片到锁屏 | [锁屏卡片](./getting-started/lock-screen.md) |
| 快速查语法、组件和 API | [速查地图](./getting-started/quickstart.md) |
| 联网、存储或读取设备数据 | [JavaScript 接口](./api/network.md) |

## 鸿蒙版能做什么？

- **桌面卡片**：支持 `1*2`、`2*2`、`2*4`、`4*4`。
- **锁屏卡片**：支持 `lock_1*1` 和 `lock_1*2`。
- **可视化布局**：文字、时钟、计时器、图片、图标、二维码、按钮、容器、列表、网格、仪表和画布。
- **JavaScript 数据**：联网、定位、文件、持久配置、用户设置、设备信息和外部调用参数。
- **系统协作**：支持 URL Scheme、AppLink、闪控球捷径以及桌面和锁屏绑定。

## 记住这一条流程

1. 在编辑器中添加组件，决定卡片长什么样。
2. 在 JavaScript 顶层声明变量，例如 `let title = "天气"`。
3. 在组件字段中用 `${title}` 显示结果。

不需要动态数据时，只做第 1 步即可。

## 遇到问题

- **数据没显示**：先在日志面板检查变量，再核对[占位符](./getting-started/placeholder.md)。
- **卡片没按时刷新**：系统决定实际时间，参见[卡片控制](./api/control.md)。
- **脚本超时**：卡片刷新中的 JavaScript 最多运行 4.5 秒，请减少串行请求并准备回退内容。
