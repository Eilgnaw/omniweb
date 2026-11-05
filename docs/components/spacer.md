---
sidebar_position: 8
---

# 间隔 Spacer

Spacer 会占满容器里的剩余空间，把前后的组件推向两边。

## 最快用法

在 `hstack` 或 `vstack` 中添加 **spacer**。它通常不需要设置属性。

## 示例：左右对齐

```text
hstack
├─ text
├─ spacer
└─ icon
```

Text 靠左，Icon 靠右，中间空间由 Spacer 填满。

## 示例：上下对齐

```text
vstack
├─ text（标题）
├─ spacer
└─ text（说明）
```

标题靠上，说明靠下。

:::tip 多个 Spacer
同一个容器里的多个 Spacer 会平分剩余空间。需要固定距离时，请设置容器间距或内边距，不要使用 Spacer。
:::
