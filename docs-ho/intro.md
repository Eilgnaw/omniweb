---
sidebar_position: 1
---

# 欢迎使用 Omni Widgets (鸿蒙版)

Omni Widgets 鸿蒙版让你**自己 DIY 鸿蒙桌面卡片**。

简单需求拖一拖就能拼出一个;复杂一点 —— 想要拉接口、读本地文件、按状态切样式 —— 内置一个 JavaScript 运行时,写一段脚本就行。

## 鸿蒙版能做什么

- **桌面卡片 2 种尺寸**:`2*2` / `2*4`
- **可视化编辑器**:文本 / 图片 / 图标 / 按钮 / 容器 / 网格…… ➕ 一下加进去
- **JavaScript 接口**:`Request` 联网、`FileManager` 读写沙盒文件、`Config` 持久化、`Setting` 用户填的参数、`Device` 设备信息
- **占位符语法**:`${变量}` 把 JS 拿到的数据,直接绑到组件上
- **跨形态共享**:同 `kind + dimension` 的多张卡片可走 `Shared.set` / `Shared.get` 共享数据

## 看哪里

第一次接触按顺序看:

1. [基础概念](./getting-started/concepts.md) —— 5 分钟搞懂卡片怎么工作
2. [做出第一个卡片](./getting-started/first-widget.md) —— 跟着做一个天气卡片
3. [占位符语法](./getting-started/placeholder.md) —— 把 JS 数据塞进组件最关键的一步

熟了直接看左边的 **组件** 和 **接口文档**。

## 遇到问题

- 卡片**不刷新**? 系统决定时机,可调 [`setUpdateFreq(min)`](./api/control.md#setupdatefreq) 建议刷新间隔
- JS **报错**? 编辑器底部「日志」面板看 `console.*` 输出和异常
- JS **超时**? 卡片侧每次 eval 上限 **4.5 秒**(对齐 FormExtension 5s 硬限制),做好兜底
