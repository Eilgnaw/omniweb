---
sidebar_position: 1
---
# 天气信息
:::info
天气信息由 Apple Weather 提供,数据每小时更新一次,该接口需要定位权限
:::


### 当前天气信息
``` js
try {
    const result = await Weather.getWeather()
    var obj = JSON.parse(result)
    this.icon = obj.symbolName
    this.text = obj.condition
    this.temp =  Math.trunc(obj.apparentTemperature.value)
    console.log(result)
} catch (error) {
    this.icon1 = 'exclamationmark.triangle.fill'
    this.temp = '检查定位权限'
    console.log(error);
}

```
返回信息参考
``` json
{
    "temperature": {
        "value": 23.07,
        "unit": {
            "converter": {
                "coefficient": 1,
                "constant": 273.15
            },
            "symbol": "°C"
        }
    },
    "pressureTrend": "falling",
    "visibility": {
        "value": 22522.81,
        "unit": {
            "symbol": "m",
            "converter": {
                "coefficient": 1,
                "constant": 0
            }
        }
    },
    "wind": {
        "compassDirection": "south",
        "direction": {
            "value": 182,
            "unit": {
                "symbol": "°",
                "converter": {
                    "coefficient": 1,
                    "constant": 0
                }
            }
        },
        "speed": {
            "unit": {
                "symbol": "km\/h",
                "converter": {
                    "coefficient": 0.277778,
                    "constant": 0
                }
            },
            "value": 22.63
        },
        "gust": {
            "value": 39,
            "unit": {
                "converter": {
                    "coefficient": 0.277778,
                    "constant": 0
                },
                "symbol": "km\/h"
            }
        }
    },
    "date": 738146429,
    "metadata": {
        "latitude": 35.694,
        "date": 738146429,
        "expirationDate": 738146729,
        "longitude": 139.767
    },
    "cloudCoverMid": 0.4,
    "condition": "mostlyCloudy",
    "symbolName": "cloud",
    "dewPoint": {
        "value": 16.86,
        "unit": {
            "converter": {
                "constant": 273.15,
                "coefficient": 1
            },
            "symbol": "°C"
        }
    },
    "humidity": 0.68,
    "pressure": {
        "value": 1010.61,
        "unit": {
            "converter": {
                "coefficient": 100,
                "constant": 0
            },
            "symbol": "mbar"
        }
    },
    "cloudCoverLow": 0.15,
    "apparentTemperature": {
        "unit": {
            "converter": {
                "coefficient": 1,
                "constant": 273.15
            },
            "symbol": "°C"
        },
        "value": 23.73
    },
    "cloudCover": 0.84,
    "rainfallAmount": {
        "pastHour": {
            "unit": {
                "converter": {
                    "coefficient": 0.001,
                    "constant": 0
                },
                "symbol": "mm"
            },
            "value": 0
        },
        "pastTwentyFourHours": {
            "value": 0,
            "unit": {
                "converter": {
                    "coefficient": 0.001,
                    "constant": 0
                },
                "symbol": "mm"
            }
        },
        "pastSixHours": {
            "unit": {
                "converter": {
                    "constant": 0,
                    "coefficient": 0.001
                },
                "symbol": "mm"
            },
            "value": 0
        }
    },
    "isDaylight": true,
    "uvIndex": {
        "value": 0,
        "category": "low"
    },
    "cloudCoverHigh": 0.92,
    "precipitationIntensity": {
        "unit": {
            "converter": {
                "constant": 0,
                "coefficient": 0.00000027777
            },
            "symbol": "mm\/h"
        },
        "value": 0
    },
    "snowfallAmount": {
        "pastTwentyFourHours": {
            "value": 0,
            "unit": {
                "symbol": "mm",
                "converter": {
                    "constant": 0,
                    "coefficient": 0.001
                }
            }
        },
        "pastHour": {
            "value": 0,
            "unit": {
                "symbol": "mm",
                "converter": {
                    "coefficient": 0.001,
                    "constant": 0
                }
            }
        },
        "pastSixHours": {
            "value": 0,
            "unit": {
                "converter": {
                    "constant": 0,
                    "coefficient": 0.001
                },
                "symbol": "mm"
            }
        }
    }
}

```

### 天气警报
:::info
未开放接口
如有需要,请联系我们开放此接口
:::



### 当日天气
:::info
未开放接口
如有需要,请联系我们开放此接口
:::


### 每小时预报
:::info
未开放接口
如有需要,请联系我们开放此接口
:::
