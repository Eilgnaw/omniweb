---
sidebar_position: 2
---

# 做出第一个卡片

跟着做完,你会有一张**显示当前天气**的桌面 `2*4` 卡片。

## 1. 新建卡片

打开 Omni → 首页右上角 `+` → 选 **桌面 `desk`** → 尺寸 **`2*4`** → 起个名字 → 进编辑器。

:::tip
刚进编辑器的卡片是空的(no template)。这是预期 —— 长按画布或点底部 ➕ 加组件才有东西渲染。
:::

## 2. 搭一个简单布局

编辑器底部点 ➕ 依次加:

- 一个 **横排**(`Row`),作为根节点
- 在横排里加一个 **图标**(`Icon`,用 emoji 或内置 glyph 名)
- 再加一个 **纵列**(`Column`)
- 在纵列里加两个 **文本**(`Text`,一个显示状况,一个显示温度)

布局大致:

```
┌─────────────────────┐
│         晴          │
│  🌞                 │
│         26°         │
└─────────────────────┘
```

## 3. 写 JS 代码

编辑器底部切到 **「代码」**,粘贴:

```js
// 拉一个天气接口(示意,自己换成可用的)
const req = new Request("https://2f0.cn/api/weather?city=Beijing")
let icon = "☀️"
let text = "未知"
let temp = "--"

try {
  const obj = await req.fetchJSON()
  icon = obj.icon            // 比如 "🌞" 或 glyph 名 "sun"
  text = obj.condition       // 比如 "晴"
  temp = Math.trunc(obj.temperature)
} catch (e) {
  console.error("天气拉取失败:", e.message)
}
```

点 **运行**。底部日志面板没异常的话,顶层变量 `icon` / `text` / `temp` 都已被赋值。

## 4. 把 JS 数据绑定到组件

回到画布,点每个组件,在它对应字段填占位符:

| 组件 | 字段 | 填什么 |
|------|------|--------|
| 图标 `Icon` | glyph(图标) | `${icon}` |
| 第一个 文本 `Text` | content(内容) | `${text}` |
| 第二个 文本 `Text` | content(内容) | `${temp}°` |

`${xxx}` 就是占位符 —— Omni 渲染前会自动替换成 JS 顶层变量 `xxx` 的值。

:::tip 占位符的更多写法
- `${obj.name}` 走点号路径
- `${rows[row]}` 在容器的「数据源」字段里写,做循环
- 详见 [占位符语法](./placeholder.md)
:::

## 5. 控制刷新频率

天气没必要一分钟刷一次。在 JS 末尾加一行:

```js
setUpdateFreq(30)  // 建议系统 30 分钟后再唤起刷新
```

:::warning
这只是「建议」。具体什么时候刷由系统决定,且鸿蒙 `FormExtensionAbility` 每次最多给 5 秒,JS 这边 4.5 秒就 timeout。详见 [组件控制](../api/control.md)。
:::

## 6. 保存 → 推到桌面

- 编辑器右上角点 **保存**
- 回桌面,长按空白 → 「添加卡片」 → 找到 **Omni** → 选 **`desk_2x4`** → 添加
- 长按你刚加的这张卡 → 「编辑」 → 选你刚做的那个

完成! 🎉

---

接下来推荐:

- [占位符语法](./placeholder.md) —— 把复杂数据塞进卡片
- [循环渲染数组](../components/stack.md#循环-datasource) —— 列表 / 网格
- [网络接口](../api/network.md) —— `Request` 完整用法
- [本地文件](../api/fileManager.md) —— 下载图片、缓存数据
