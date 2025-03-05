---
sidebar_position: 5
---
# 天气信息
:::info
天气信息由 Apple Weather 提供,数据每小时更新一次,该接口需要定位权限
:::


### 当前天气信息
``` js
try {
    const result = await Weather.getCurrent()
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
<details>
<summary>展开查看</summary>
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
</details>

### 今日天气
``` js
const result = await Weather.getToday()
var obj = JSON.parse(result)
this.icon = obj.symbolName
this.text = obj.condition
this.temp =  Math.trunc(obj.apparentTemperature.value)
console.log(result)
```

返回信息参考
<details>
<summary>展开查看</summary>
``` json
{
    "metadata": {
        "date": 1738921921000,
        "longitude": 115.0999984741211,
        "latitude": 33.40999984741211,
        "expirationDate": 1738924990000
    },
    "forecast": [
        {
            "wind": {
                "compassDirection": "northeast",
                "speed": {
                    "value": 15.911492347717285,
                    "unit": {
                        "converter": {
                            "constant": 0,
                            "coefficient": 0.277778
                        },
                        "symbol": "km\/h"
                    }
                },
                "direction": {
                    "value": 48,
                    "unit": {
                        "converter": {
                            "constant": 0,
                            "coefficient": 1
                        },
                        "symbol": "°"
                    }
                },
                "gust": {
                    "unit": {
                        "converter": {
                            "constant": 0,
                            "coefficient": 0.277778
                        },
                        "symbol": "km\/h"
                    },
                    "value": 46.83003234863281
                }
            },
            "maximumVisibility": 22443.431640625,
            "highTemperature": {
                "value": 2.2208800315856934,
                "unit": {
                    "symbol": "°C",
                    "converter": {
                        "coefficient": 1,
                        "constant": 273.15
                    }
                }
            },
            "precipitationChance": 0,
            "symbolName": "sun.max",
            "rainfallAmount": {
                "unit": {
                    "symbol": "mm",
                    "converter": {
                        "coefficient": 0.001,
                        "constant": 0
                    }
                },
                "value": 0
            },
            "humidityMin": 0.19,
            "lowTemperature": {
                "value": -6.3786396980285645,
                "unit": {
                    "symbol": "°C",
                    "converter": {
                        "coefficient": 1,
                        "constant": 273.15
                    }
                }
            },
            "visibilityMin": 16224.8056640625,
            "highWindSpeed": {
                "value": 25.94852066040039,
                "unit": {
                    "symbol": "km\/h",
                    "converter": {
                        "coefficient": 0.277778,
                        "constant": 0
                    }
                }
            },
            "date": 1738857600000,
            "minimumVisibility": 16224.8056640625,
            "windSpeedMax": {
                "value": 25.94852066040039,
                "unit": {
                    "converter": {
                        "constant": 0,
                        "coefficient": 0.277778
                    },
                    "symbol": "km\/h"
                }
            },
            "lowTemperatureTime": 1738944000000,
            "highTemperatureTime": 1738857600000,
            "minimumHumidity": 0.19,
            "maximumHumidity": 0.46,
            "visibilityMax": 22443.431640625,
            "uvIndex": {
                "category": "moderate",
                "value": 4
            },
            "humidityMax": 0.46,
            "snowfallAmount": {
                "value": 0,
                "unit": {
                    "symbol": "mm",
                    "converter": {
                        "coefficient": 0.001,
                        "constant": 0
                    }
                }
            },
            "daytimeForecast": {
                "precipitation": "none",
                "minimumVisibility": {
                    "value": 21042.423828125,
                    "unit": {
                        "converter": {
                            "coefficient": 1,
                            "constant": 0
                        },
                        "symbol": "m"
                    }
                },
                "highTemperature": {
                    "value": 0.21475492417812347,
                    "unit": {
                        "converter": {
                            "coefficient": 1,
                            "constant": 273.15
                        },
                        "symbol": "°C"
                    }
                },
                "condition": "mostlyClear",
                "precipitationChance": 0,
                "lowTemperature": {
                    "value": -6.1808037757873535,
                    "unit": {
                        "symbol": "°C",
                        "converter": {
                            "constant": 273.15,
                            "coefficient": 1
                        }
                    }
                },
                "precipitationAmountByType": {
                    "mixed": {
                        "unit": {
                            "converter": {
                                "constant": 0,
                                "coefficient": 0.001
                            },
                            "symbol": "mm"
                        },
                        "value": 0
                    },
                    "precipitation": {
                        "value": 0,
                        "unit": {
                            "symbol": "mm",
                            "converter": {
                                "coefficient": 0.001,
                                "constant": 0
                            }
                        }
                    },
                    "snowfallAmount": {
                        "maximumLiquidEquivalent": {
                            "value": 0,
                            "unit": {
                                "symbol": "mm",
                                "converter": {
                                    "constant": 0,
                                    "coefficient": 0.001
                                }
                            }
                        },
                        "amount": {
                            "value": 0,
                            "unit": {
                                "converter": {
                                    "constant": 0,
                                    "coefficient": 0.001
                                },
                                "symbol": "mm"
                            }
                        },
                        "maximum": {
                            "value": 0,
                            "unit": {
                                "converter": {
                                    "constant": 0,
                                    "coefficient": 0.001
                                },
                                "symbol": "mm"
                            }
                        },
                        "amountLiquidEquivalent": {
                            "unit": {
                                "symbol": "mm",
                                "converter": {
                                    "coefficient": 0.001,
                                    "constant": 0
                                }
                            },
                            "value": 0
                        },
                        "minimum": {
                            "value": 0,
                            "unit": {
                                "symbol": "mm",
                                "converter": {
                                    "coefficient": 0.001,
                                    "constant": 0
                                }
                            }
                        },
                        "minimumLiquidEquivalent": {
                            "value": 0,
                            "unit": {
                                "symbol": "mm",
                                "converter": {
                                    "coefficient": 0.001,
                                    "constant": 0
                                }
                            }
                        }
                    },
                    "hail": {
                        "value": 0,
                        "unit": {
                            "converter": {
                                "coefficient": 0.001,
                                "constant": 0
                            },
                            "symbol": "mm"
                        }
                    },
                    "rainfall": {
                        "value": 0,
                        "unit": {
                            "converter": {
                                "constant": 0,
                                "coefficient": 0.001
                            },
                            "symbol": "mm"
                        }
                    },
                    "sleet": {
                        "value": 0,
                        "unit": {
                            "symbol": "mm",
                            "converter": {
                                "constant": 0,
                                "coefficient": 0.001
                            }
                        }
                    }
                },
                "highWindSpeed": {
                    "value": 21.075048446655273,
                    "unit": {
                        "symbol": "km\/h",
                        "converter": {
                            "coefficient": 0.277778,
                            "constant": 0
                        }
                    }
                },
                "maximumHumidity": 0.32,
                "minimumHumidity": 0.19,
                "cloudCoverByAltitude": {
                    "medium": 0.26,
                    "high": 0.34,
                    "low": 0
                },
                "cloudCover": 0.27,
                "wind": {
                    "speed": {
                        "value": 16.085134506225586,
                        "unit": {
                            "symbol": "km\/h",
                            "converter": {
                                "constant": 0,
                                "coefficient": 0.277778
                            }
                        }
                    },
                    "compassDirection": "north",
                    "gust": {
                        "value": 41.098751068115234,
                        "unit": {
                            "converter": {
                                "coefficient": 0.277778,
                                "constant": 0
                            },
                            "symbol": "km\/h"
                        }
                    },
                    "direction": {
                        "value": 7,
                        "unit": {
                            "symbol": "°",
                            "converter": {
                                "coefficient": 1,
                                "constant": 0
                            }
                        }
                    }
                },
                "maximumVisibility": {
                    "unit": {
                        "symbol": "m",
                        "converter": {
                            "coefficient": 1,
                            "constant": 0
                        }
                    },
                    "value": 22437.6484375
                }
            },
            "windGustSpeedMax": {
                "unit": {
                    "converter": {
                        "constant": 0,
                        "coefficient": 0.277778
                    },
                    "symbol": "km\/h"
                },
                "value": 46.83003234863281
            },
            "condition": "mostlyClear",
            "sun": {
                "sunrise": 1738883466000,
                "sunset": 1738922210000,
                "astronomicalDusk": 1738927267000,
                "civilDusk": 1738923756000,
                "civilDawn": 1738881924000,
                "nauticalDawn": 1738880157000,
                "nauticalDusk": 1738925521000,
                "astronomicalDawn": 1738878414000,
                "solarMidnight": 1738859618000,
                "solarNoon": 1738902835000
            },
            "moon": {
                "moonset": 1738867371000,
                "phase": "waxingGibbous",
                "moonrise": 1738902742000
            },
            "precipitation": "none",
            "humidity": 0,
            "precipitationAmountByType": {
                "hail": {
                    "value": 0,
                    "unit": {
                        "symbol": "mm",
                        "converter": {
                            "constant": 0,
                            "coefficient": 0.001
                        }
                    }
                },
                "precipitation": {
                    "value": 0,
                    "unit": {
                        "symbol": "mm",
                        "converter": {
                            "coefficient": 0.001,
                            "constant": 0
                        }
                    }
                },
                "sleet": {
                    "value": 0,
                    "unit": {
                        "converter": {
                            "coefficient": 0.001,
                            "constant": 0
                        },
                        "symbol": "mm"
                    }
                },
                "rainfall": {
                    "value": 0,
                    "unit": {
                        "converter": {
                            "coefficient": 0.001,
                            "constant": 0
                        },
                        "symbol": "mm"
                    }
                },
                "mixed": {
                    "value": 0,
                    "unit": {
                        "converter": {
                            "constant": 0,
                            "coefficient": 0.001
                        },
                        "symbol": "mm"
                    }
                },
                "snowfallAmount": {
                    "minimum": {
                        "unit": {
                            "converter": {
                                "coefficient": 0.001,
                                "constant": 0
                            },
                            "symbol": "mm"
                        },
                        "value": 0
                    },
                    "maximum": {
                        "unit": {
                            "symbol": "mm",
                            "converter": {
                                "constant": 0,
                                "coefficient": 0.001
                            }
                        },
                        "value": 0
                    },
                    "amountLiquidEquivalent": {
                        "unit": {
                            "symbol": "mm",
                            "converter": {
                                "constant": 0,
                                "coefficient": 0.001
                            }
                        },
                        "value": 0
                    },
                    "minimumLiquidEquivalent": {
                        "unit": {
                            "converter": {
                                "coefficient": 0.001,
                                "constant": 0
                            },
                            "symbol": "mm"
                        },
                        "value": 0
                    },
                    "maximumLiquidEquivalent": {
                        "unit": {
                            "symbol": "mm",
                            "converter": {
                                "constant": 0,
                                "coefficient": 0.001
                            }
                        },
                        "value": 0
                    },
                    "amount": {
                        "value": 0,
                        "unit": {
                            "symbol": "mm",
                            "converter": {
                                "coefficient": 0.001,
                                "constant": 0
                            }
                        }
                    }
                }
            },
            "restOfDayForecast": {
                "cloudCoverByAltitude": {
                    "medium": 0.11,
                    "high": 0.21,
                    "low": 0
                },
                "precipitationChance": 0,
                "minimumHumidity": 0.26,
                "lowTemperature": {
                    "unit": {
                        "converter": {
                            "constant": 273.15,
                            "coefficient": 1
                        },
                        "symbol": "°C"
                    },
                    "value": -6.3786396980285645
                },
                "wind": {
                    "speed": {
                        "unit": {
                            "converter": {
                                "coefficient": 0.277778,
                                "constant": 0
                            },
                            "symbol": "km\/h"
                        },
                        "value": 5.852397441864014
                    },
                    "gust": {
                        "value": 13.547345161437988,
                        "unit": {
                            "symbol": "km\/h",
                            "converter": {
                                "constant": 0,
                                "coefficient": 0.277778
                            }
                        }
                    },
                    "direction": {
                        "value": 48,
                        "unit": {
                            "converter": {
                                "coefficient": 1,
                                "constant": 0
                            },
                            "symbol": "°"
                        }
                    },
                    "compassDirection": "northeast"
                },
                "highTemperature": {
                    "unit": {
                        "symbol": "°C",
                        "converter": {
                            "coefficient": 1,
                            "constant": 273.15
                        }
                    },
                    "value": -2.110377311706543
                },
                "precipitationAmountByType": {
                    "snowfallAmount": {
                        "amountLiquidEquivalent": {
                            "value": 0,
                            "unit": {
                                "symbol": "mm",
                                "converter": {
                                    "constant": 0,
                                    "coefficient": 0.001
                                }
                            }
                        },
                        "amount": {
                            "value": 0,
                            "unit": {
                                "converter": {
                                    "coefficient": 0.001,
                                    "constant": 0
                                },
                                "symbol": "mm"
                            }
                        },
                        "minimum": {
                            "unit": {
                                "converter": {
                                    "coefficient": 0.001,
                                    "constant": 0
                                },
                                "symbol": "mm"
                            },
                            "value": 0
                        },
                        "maximumLiquidEquivalent": {
                            "value": 0,
                            "unit": {
                                "symbol": "mm",
                                "converter": {
                                    "constant": 0,
                                    "coefficient": 0.001
                                }
                            }
                        },
                        "maximum": {
                            "unit": {
                                "symbol": "mm",
                                "converter": {
                                    "coefficient": 0.001,
                                    "constant": 0
                                }
                            },
                            "value": 0
                        },
                        "minimumLiquidEquivalent": {
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
                    "sleet": {
                        "value": 0,
                        "unit": {
                            "converter": {
                                "constant": 0,
                                "coefficient": 0.001
                            },
                            "symbol": "mm"
                        }
                    },
                    "mixed": {
                        "unit": {
                            "symbol": "mm",
                            "converter": {
                                "constant": 0,
                                "coefficient": 0.001
                            }
                        },
                        "value": 0
                    },
                    "hail": {
                        "unit": {
                            "symbol": "mm",
                            "converter": {
                                "constant": 0,
                                "coefficient": 0.001
                            }
                        },
                        "value": 0
                    },
                    "precipitation": {
                        "unit": {
                            "symbol": "mm",
                            "converter": {
                                "coefficient": 0.001,
                                "constant": 0
                            }
                        },
                        "value": 0
                    },
                    "rainfall": {
                        "value": 0,
                        "unit": {
                            "converter": {
                                "coefficient": 0.001,
                                "constant": 0
                            },
                            "symbol": "mm"
                        }
                    }
                },
                "highWindSpeed": {
                    "value": 9.795101165771484,
                    "unit": {
                        "converter": {
                            "coefficient": 0.277778,
                            "constant": 0
                        },
                        "symbol": "km\/h"
                    }
                },
                "maximumHumidity": 0.46,
                "maximumVisibility": {
                    "value": 21182.73046875,
                    "unit": {
                        "symbol": "m",
                        "converter": {
                            "constant": 0,
                            "coefficient": 1
                        }
                    }
                },
                "condition": "mostlyClear",
                "precipitation": "none",
                "cloudCover": 0.21,
                "minimumVisibility": {
                    "unit": {
                        "converter": {
                            "coefficient": 1,
                            "constant": 0
                        },
                        "symbol": "m"
                    },
                    "value": 20356.44921875
                }
            },
            "windSpeedAvg": {
                "value": 15.911492347717285,
                "unit": {
                    "symbol": "km\/h",
                    "converter": {
                        "constant": 0,
                        "coefficient": 0.277778
                    }
                }
            },
            "overnightForecast": {
                "wind": {
                    "gust": {
                        "value": 11.619728088378906,
                        "unit": {
                            "converter": {
                                "coefficient": 0.277778,
                                "constant": 0
                            },
                            "symbol": "km\/h"
                        }
                    },
                    "direction": {
                        "value": 72,
                        "unit": {
                            "converter": {
                                "coefficient": 1,
                                "constant": 0
                            },
                            "symbol": "°"
                        }
                    },
                    "speed": {
                        "unit": {
                            "converter": {
                                "coefficient": 0.277778,
                                "constant": 0
                            },
                            "symbol": "km\/h"
                        },
                        "value": 3.1236138343811035
                    },
                    "compassDirection": "eastNortheast"
                },
                "minimumHumidity": 0.32,
                "cloudCoverByAltitude": {
                    "medium": 0.15,
                    "high": 0.36,
                    "low": 0
                },
                "minimumVisibility": {
                    "unit": {
                        "symbol": "m",
                        "converter": {
                            "constant": 0,
                            "coefficient": 1
                        }
                    },
                    "value": 19825.79296875
                },
                "highTemperature": {
                    "value": -3.6212000846862793,
                    "unit": {
                        "symbol": "°C",
                        "converter": {
                            "coefficient": 1,
                            "constant": 273.15
                        }
                    }
                },
                "precipitationAmountByType": {
                    "rainfall": {
                        "unit": {
                            "converter": {
                                "coefficient": 0.001,
                                "constant": 0
                            },
                            "symbol": "mm"
                        },
                        "value": 0
                    },
                    "snowfallAmount": {
                        "amount": {
                            "value": 0,
                            "unit": {
                                "symbol": "mm",
                                "converter": {
                                    "coefficient": 0.001,
                                    "constant": 0
                                }
                            }
                        },
                        "minimum": {
                            "value": 0,
                            "unit": {
                                "symbol": "mm",
                                "converter": {
                                    "coefficient": 0.001,
                                    "constant": 0
                                }
                            }
                        },
                        "amountLiquidEquivalent": {
                            "value": 0,
                            "unit": {
                                "converter": {
                                    "coefficient": 0.001,
                                    "constant": 0
                                },
                                "symbol": "mm"
                            }
                        },
                        "maximumLiquidEquivalent": {
                            "value": 0,
                            "unit": {
                                "symbol": "mm",
                                "converter": {
                                    "coefficient": 0.001,
                                    "constant": 0
                                }
                            }
                        },
                        "maximum": {
                            "value": 0,
                            "unit": {
                                "symbol": "mm",
                                "converter": {
                                    "coefficient": 0.001,
                                    "constant": 0
                                }
                            }
                        },
                        "minimumLiquidEquivalent": {
                            "value": 0,
                            "unit": {
                                "converter": {
                                    "coefficient": 0.001,
                                    "constant": 0
                                },
                                "symbol": "mm"
                            }
                        }
                    },
                    "sleet": {
                        "unit": {
                            "symbol": "mm",
                            "converter": {
                                "coefficient": 0.001,
                                "constant": 0
                            }
                        },
                        "value": 0
                    },
                    "precipitation": {
                        "unit": {
                            "symbol": "mm",
                            "converter": {
                                "constant": 0,
                                "coefficient": 0.001
                            }
                        },
                        "value": 0
                    },
                    "hail": {
                        "unit": {
                            "converter": {
                                "coefficient": 0.001,
                                "constant": 0
                            },
                            "symbol": "mm"
                        },
                        "value": 0
                    },
                    "mixed": {
                        "unit": {
                            "converter": {
                                "coefficient": 0.001,
                                "constant": 0
                            },
                            "symbol": "mm"
                        },
                        "value": 0
                    }
                },
                "highWindSpeed": {
                    "value": 7.526129722595215,
                    "unit": {
                        "symbol": "km\/h",
                        "converter": {
                            "constant": 0,
                            "coefficient": 0.277778
                        }
                    }
                },
                "maximumHumidity": 0.48,
                "lowTemperature": {
                    "value": -6.949804782867432,
                    "unit": {
                        "symbol": "°C",
                        "converter": {
                            "coefficient": 1,
                            "constant": 273.15
                        }
                    }
                },
                "maximumVisibility": {
                    "value": 21081.048828125,
                    "unit": {
                        "symbol": "m",
                        "converter": {
                            "constant": 0,
                            "coefficient": 1
                        }
                    }
                },
                "precipitation": "none",
                "condition": "partlyCloudy",
                "precipitationChance": 0,
                "cloudCover": 0.41
            }
        }
    ]
}
```
</details>

### 天气警报
:::info
未开放接口
如有需要,请联系我们开放此接口
:::


### 每小时预报
:::info
未开放接口
如有需要,请联系我们开放此接口
:::
