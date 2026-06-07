---
sidebar_position: 1
---

# 基础概念

5 分钟搞懂 Omni 鸿蒙版怎么工作。

## 一、卡片形态

当前版本支持桌面卡片和锁屏卡片:

| 形态 (`kind`) | 尺寸 (`dimension`) | 出现在哪里 |
|---|---|---|
| 桌面 `desk` | `1*2` / `2*2` / `2*4` / `4*4` | 主屏幕 |
| 锁屏 `lock` | `lock_1*1` / `lock_1*2` | 锁屏 |

每种 `kind + dimension` 组合在编辑器里画布大小不同。新建卡片时先选 `kind + dimension`。

桌面卡片添加到主屏幕后,可以在系统卡片编辑里选择具体卡片。锁屏卡片添加到锁屏后会先显示「点击选择卡片」占位,点占位回到 Omni 选择同尺寸锁屏卡片。详见 [锁屏卡片](./lock-screen.md)。

## 二、一张卡片由两部分组成

### 1. 视图(看得见的部分)

视图由**组件**搭出来,目前支持:

- **文本** `Text` / **图片** `Image` / **图标** `Icon`
- **时钟** `TextClock` / **计时器** `TextTimer`
- **按钮** `Button`(容器,可放子节点)
- **容器**:`Column` / `Row` / `Stack` / `VStack` / `HStack` / `Grid`
- **占位** `Blank`(撑剩余空间)

每个组件支持的属性见左侧 [组件](../components/text.md) 一节。

### 2. 数据(动态的部分)

想让卡片显示「实时数据」(天气、未读、股价、Pos 排名 ...),写一段 **JavaScript**:

```js
// 例:拉一个接口
const req = new Request("https://2f0.cn/api/omni")
const obj = await req.fetchJSON()

let title = obj.omni      // 写到顶层变量,组件就能用
let count = 12
```

代码运行完,JS 顶层变量被收集成一个 bindings 对象,再通过**占位符**绑到组件上:

```
文本组件的「内容」字段写: ${title}
                  → 显示 obj.omni 的值
```

## 三、变量怎么"被组件看到"

JS 运行后,Omni 会自动把顶层 `const` / `let` / `var` 声明的变量收集成 bindings:

```js
const title = "未读"      // ✅ 进 bindings
let   count = 12          // ✅ 进 bindings
var   tag   = "new"       // ✅ 进 bindings

const _PAGE_SIZE = 20     // ❌ `_` 开头按惯例当私有,不进 bindings
function load() {
  const now = new Date()  // ❌ 函数内局部,不进 bindings
}
```

:::tip 关键规则
**只有顶层(行首零缩进)的 `const` / `let` / `var` 才被收集。** 解构 `const {a, b} = obj` 暂不进 bindings。
:::

:::warning 顶层必须返回一个对象
内部已自动 `(async () => { ...; return { ...vars }; })()`。你只管写普通顶层代码就行,**别再自己写 `return`**。
:::

## 四、JS 使用

- ✅ 标准 JS 语法、`async/await`、`Promise`、`Date`、`JSON`、`Math` 都能用
- ✅ 内置 `Request` / `FileManager` / `Config` / `Shared` / `Setting` / `Device` / `openUrl` / `setUpdateFreq` / `sleep` / `isDebug` / `console`
- ❌ 没有 `window`、`document`、浏览器 `fetch`(用 `Request` 替代)
- ❌ 没有 npm,只能用 Omni 内置的接口
- ⚠️ **卡片侧 JS 每次 eval 上限 4.5 秒**,超时会回退到上一次成功的 bindings

## 五、卡片什么时候刷新?

系统(`FormExtensionAbility`)决定。你能做的两件事:

- `setUpdateFreq(min)`:建议系统多少分钟后再唤起一次刷新
- `setUpdateTime(ts)`:建议系统在某个绝对时间(ms 时间戳)再唤起

这两个**只是建议**,具体节奏看系统调度。详见 [`api/control`](../api/control.md)。

:::warning
不要指望秒级刷新。当前桌面卡片走系统调度,做不了「秒级近实时」。
:::

## 六、设置项 ——「让别人用你的模板」

如果你做了张卡片想分享给别人,但别人需要填自己的 token / 城市 / 图片 —— 用「设置项」。

- 在 JS 里 `Setting.get("city", "北京")` 读
- 用户在卡片设置面板里填的值落到 `widget.setting`(JSON 对象)
- 跨次运行持久化

详见 [`api/config#setting`](../api/config.md#setting--用户填的参数)。

---

下一步:[做出第一个卡片 →](./first-widget.md)
