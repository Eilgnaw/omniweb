---
sidebar_position: 1
---

# Omni Widgets 使用文档

Omni Widgets 让你用可视化编辑器制作 iOS 小组件。先摆好文字、图片和容器；需要动态数据时，再加一段 JavaScript。

:::tip 第一次使用？
直接跟着[做出第一个小组件](./getting-started/first-widget.md)操作。大约 10 分钟，你会完成一个能自动更新天气的中号小组件。
:::

## 你想完成什么？

| 目标 | 从这里开始 |
| --- | --- |
| 第一次做小组件 | [做出第一个小组件](./getting-started/first-widget.md) |
| 先了解 Omni 的工作方式 | [基础概念](./getting-started/concepts.md) |
| 把 JS 数据显示到组件上 | [占位符语法](./getting-started/placeholder.md) |
| 查文字、图片、容器等用法 | [组件](./components/text.md) |
| 联网、读天气、健康或日历 | [JavaScript 接口](./api/network.md) |

## Omni 能做什么？

- **覆盖常用系统位置**：主屏幕小、中、大号，锁屏圆形、矩形、内联，控制中心按钮、开关，以及实时活动。
- **可视化搭布局**：添加文字、图片、SF Symbols、形状、按钮、容器、网格和画布，不写代码也能完成静态小组件。
- **用 JavaScript 获取数据**：请求网络，读取天气、位置、健康、日历和文件，再把结果显示到组件上。
- **接入系统能力**：支持 URL Scheme、快捷指令、iCloud 文件和实时活动推送。

## 记住这一条流程

1. 在编辑器里添加组件，决定小组件长什么样。
2. 在 JavaScript 里把结果写到变量。
3. 在组件属性里用 `${变量名}` 显示结果。

不需要动态数据时，只做第 1 步即可。

## 遇到问题

- **数据没有显示**：先在控制台输出变量，再检查[占位符](./getting-started/placeholder.md)是否写对。
- **小组件没有按时刷新**：刷新时间由 iOS 调度，参见[组件控制](./api/control.md)。
- **想了解最近变化**：查看[更新日志](./changelog.md)。
