---
sidebar_position: 6
---
# 健康信息
:::info
健康信息可用于获取用户健康 APP内的相关信息,目前仅支持睡眠信息,待完善
:::

### 睡眠信息
睡眠信息数据仅获取 Apple Watch 写入的数据,不支持其它数据来源

#### 获取最后一天的睡眠数据
``` js
const result = await Health.getLastSleepDetail()
var obj = JSON.parse(result)
var datas = obj.sleepDatas
console.log(result)
datas.forEach(item => {
   this[`time${item.category}`]= formatDuration(item.seconds)
  console.log(`Category: ${item.category}, Duration: ${formatDuration(item.seconds)}`)
})
//{"endDate":1738879690763.0796,"sleepDatas":[{"category":4,"seconds":3000},{"seconds":15030,"category":3},{"category":2,"seconds":2700},{"seconds":4320,"category":5},{"category":99,"seconds":22350}],"startDate":1738854640763.0796}

// Category: 4, Duration: 50分     *深度

// Category: 3, Duration: 4时11分  *核心

// Category: 2, Duration: 45分     *清醒

// Category: 5, Duration: 1时12分  *眼动

// Category: 99, Duration: 6时13分 *不包含清醒时间的总睡眠时间

```
#### 获取最近两天所有的睡眠信息
``` js
const result = await Health.getSleepData()
console.log(result)
```
返回值参考
<details>
<summary>展开查看</summary>
``` json
[
    {
        "startDate": 1738854640763.0796,
        "endDate": 1738855510763.0796,
        "value": 3,
        "sleepState": "sleepCore"
    },
    {
        "value": 4,
        "endDate": 1738855870763.0796,
        "startDate": 1738855510763.0796,
        "sleepState": "asleepDeep"
    },
    {
        "sleepState": "sleepCore",
        "value": 3,
        "endDate": 1738855900763.0796,
        "startDate": 1738855870763.0796
    },
    {
        "startDate": 1738855900763.0796,
        "value": 2,
        "endDate": 1738855990763.0796,
        "sleepState": "Awake"
    },
    {
        "endDate": 1738856050763.0796,
        "value": 3,
        "sleepState": "sleepCore",
        "startDate": 1738855990763.0796
    },
    {
        "endDate": 1738856170763.0796,
        "value": 2,
        "startDate": 1738856050763.0796,
        "sleepState": "Awake"
    },
    {
        "sleepState": "sleepCore",
        "value": 3,
        "endDate": 1738857280763.0796,
        "startDate": 1738856170763.0796
    },
    {
        "startDate": 1738857280763.0796,
        "endDate": 1738859230763.0796,
        "value": 4,
        "sleepState": "asleepDeep"
    },
    {
        "endDate": 1738859770763.0796,
        "sleepState": "sleepCore",
        "value": 3,
        "startDate": 1738859230763.0796
    },
    {
        "sleepState": "asleepREM",
        "startDate": 1738859770763.0796,
        "value": 5,
        "endDate": 1738861150763.0796
    },
    {
        "startDate": 1738861150763.0796,
        "value": 2,
        "sleepState": "Awake",
        "endDate": 1738861210763.0796
    },
    {
        "endDate": 1738862950763.0796,
        "startDate": 1738861210763.0796,
        "sleepState": "sleepCore",
        "value": 3
    },
    {
        "endDate": 1738863340763.0796,
        "sleepState": "asleepDeep",
        "value": 4,
        "startDate": 1738862950763.0796
    },
    {
        "value": 3,
        "endDate": 1738864390763.0796,
        "startDate": 1738863340763.0796,
        "sleepState": "sleepCore"
    },
    {
        "endDate": 1738864450763.0796,
        "startDate": 1738864390763.0796,
        "sleepState": "Awake",
        "value": 2
    },
    {
        "endDate": 1738865680763.0796,
        "value": 3,
        "sleepState": "sleepCore",
        "startDate": 1738864450763.0796
    },
    {
        "value": 2,
        "sleepState": "Awake",
        "startDate": 1738865680763.0796,
        "endDate": 1738865800763.0796
    },
    {
        "startDate": 1738865800763.0796,
        "sleepState": "sleepCore",
        "endDate": 1738866460763.0796,
        "value": 3
    },
    {
        "startDate": 1738866460763.0796,
        "sleepState": "Awake",
        "value": 2,
        "endDate": 1738866550763.0796
    },
    {
        "value": 3,
        "endDate": 1738866730763.0796,
        "startDate": 1738866550763.0796,
        "sleepState": "sleepCore"
    },
    {
        "endDate": 1738866760763.0796,
        "value": 2,
        "sleepState": "Awake",
        "startDate": 1738866730763.0796
    },
    {
        "startDate": 1738866760763.0796,
        "sleepState": "sleepCore",
        "endDate": 1738867090763.0796,
        "value": 3
    },
    {
        "endDate": 1738867210763.0796,
        "sleepState": "asleepREM",
        "startDate": 1738867090763.0796,
        "value": 5
    },
    {
        "startDate": 1738867210763.0796,
        "value": 2,
        "endDate": 1738867300763.0796,
        "sleepState": "Awake"
    },
    {
        "endDate": 1738867390763.0796,
        "sleepState": "sleepCore",
        "startDate": 1738867300763.0796,
        "value": 3
    },
    {
        "value": 5,
        "endDate": 1738867480763.0796,
        "startDate": 1738867390763.0796,
        "sleepState": "asleepREM"
    },
    {
        "value": 2,
        "endDate": 1738867510763.0796,
        "startDate": 1738867480763.0796,
        "sleepState": "Awake"
    },
    {
        "startDate": 1738867510763.0796,
        "endDate": 1738867600763.0796,
        "sleepState": "sleepCore",
        "value": 3
    },
    {
        "value": 5,
        "sleepState": "asleepREM",
        "endDate": 1738867660763.0796,
        "startDate": 1738867600763.0796
    },
    {
        "endDate": 1738867690763.0796,
        "startDate": 1738867660763.0796,
        "value": 3,
        "sleepState": "sleepCore"
    },
    {
        "value": 2,
        "endDate": 1738867720763.0796,
        "startDate": 1738867690763.0796,
        "sleepState": "Awake"
    },
    {
        "sleepState": "sleepCore",
        "value": 3,
        "endDate": 1738870210763.0796,
        "startDate": 1738867720763.0796
    },
    {
        "sleepState": "asleepDeep",
        "value": 4,
        "startDate": 1738870210763.0796,
        "endDate": 1738870510763.0796
    },
    {
        "endDate": 1738872580763.0796,
        "startDate": 1738870510763.0796,
        "value": 3,
        "sleepState": "sleepCore"
    },
    {
        "startDate": 1738872580763.0796,
        "endDate": 1738872640763.0796,
        "value": 2,
        "sleepState": "Awake"
    },
    {
        "value": 3,
        "sleepState": "sleepCore",
        "endDate": 1738872880763.0796,
        "startDate": 1738872640763.0796
    },
    {
        "sleepState": "asleepREM",
        "value": 5,
        "startDate": 1738872880763.0796,
        "endDate": 1738873120763.0796
    },
    {
        "value": 2,
        "startDate": 1738873120763.0796,
        "endDate": 1738873210763.0796,
        "sleepState": "Awake"
    },
    {
        "value": 3,
        "endDate": 1738873330763.0796,
        "startDate": 1738873210763.0796,
        "sleepState": "sleepCore"
    },
    {
        "endDate": 1738873840763.0796,
        "startDate": 1738873330763.0796,
        "sleepState": "asleepREM",
        "value": 5
    },
    {
        "sleepState": "Awake",
        "endDate": 1738874020763.0796,
        "value": 2,
        "startDate": 1738873840763.0796
    },
    {
        "sleepState": "sleepCore",
        "value": 3,
        "startDate": 1738874020763.0796,
        "endDate": 1738874080763.0796
    },
    {
        "startDate": 1738874080763.0796,
        "sleepState": "asleepREM",
        "value": 5,
        "endDate": 1738875520763.0796
    },
    {
        "endDate": 1738875580763.0796,
        "startDate": 1738875520763.0796,
        "sleepState": "Awake",
        "value": 2
    },
    {
        "value": 3,
        "sleepState": "sleepCore",
        "endDate": 1738875610763.0796,
        "startDate": 1738875580763.0796
    },
    {
        "startDate": 1738875610763.0796,
        "sleepState": "asleepREM",
        "value": 5,
        "endDate": 1738875640763.0796
    },
    {
        "sleepState": "Awake",
        "endDate": 1738876540763.0796,
        "value": 2,
        "startDate": 1738875640763.0796
    },
    {
        "value": 3,
        "endDate": 1738877200763.0796,
        "startDate": 1738876540763.0796,
        "sleepState": "sleepCore"
    },
    {
        "startDate": 1738877200763.0796,
        "endDate": 1738877260763.0796,
        "sleepState": "Awake",
        "value": 2
    },
    {
        "value": 3,
        "startDate": 1738877260763.0796,
        "endDate": 1738877380763.0796,
        "sleepState": "sleepCore"
    },
    {
        "value": 2,
        "sleepState": "Awake",
        "startDate": 1738877380763.0796,
        "endDate": 1738877740763.0796
    },
    {
        "startDate": 1738877740763.0796,
        "endDate": 1738878490763.0796,
        "sleepState": "sleepCore",
        "value": 3
    },
    {
        "endDate": 1738878940763.0796,
        "startDate": 1738878490763.0796,
        "sleepState": "asleepREM",
        "value": 5
    },
    {
        "endDate": 1738879060763.0796,
        "startDate": 1738878940763.0796,
        "value": 2,
        "sleepState": "Awake"
    },
    {
        "value": 3,
        "startDate": 1738879060763.0796,
        "sleepState": "sleepCore",
        "endDate": 1738879390763.0796
    },
    {
        "startDate": 1738879390763.0796,
        "endDate": 1738879540763.0796,
        "value": 2,
        "sleepState": "Awake"
    },
    {
        "sleepState": "sleepCore",
        "startDate": 1738879540763.0796,
        "value": 3,
        "endDate": 1738879690763.0796
    }
]
```
</details>