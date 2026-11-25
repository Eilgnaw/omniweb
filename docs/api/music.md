---
sidebar_position: 9
---

# Apple Music

`AppleMusic` 可以读取和控制系统“音乐”App，也可以查询 Apple Music 目录中的排行榜、歌曲、专辑、歌单，以及用户的推荐和最近播放内容。播放器控制使用用户当前的系统播放器，不会在 Omni Widgets 内创建一套独立播放队列。

## 首次授权

先在主 App 的代码编辑器中检查并申请权限：

```js
let musicAuthorization = AppleMusic.authorizationStatus()

if (musicAuthorization === 'notDetermined') {
  musicAuthorization = await AppleMusic.requestAuthorization()
}
```

`authorizationStatus()` 可能返回 `notDetermined`、`denied`、`restricted` 或 `authorized`。

:::warning 授权弹窗只能从主 App 发起
小组件刷新时调用 `requestAuthorization()` 会以 `apple_music_authorization_requires_app` 失败。请先打开 Omni Widgets，在代码编辑器中运行一次授权代码。用户拒绝或限制访问时，其他异步 API 会以 `apple_music_not_authorized` 失败。
:::

:::warning 目录接口还需要启用 MusicKit App Service
在 Apple Developer 的 Certificates, Identifiers & Profiles 中，为 `com.eilgnaw.AWidget` 启用 MusicKit App Service。若要在桌面小组件刷新时直接请求排行榜或推荐，也要为 `com.eilgnaw.AWidget.AWidgetExtension` 启用。MusicKit 会根据 Bundle ID 自动生成目录请求需要的开发者 Token；这项配置不写在 entitlements 文件里。
:::

## 获取当前歌曲

```js
const song = await AppleMusic.nowPlaying()

const title = song?.title ?? '没有播放歌曲'
const artist = song?.artist ?? ''
const album = song?.albumTitle ?? ''
const isPlaying = song?.state === 'playing'
```

没有当前歌曲时返回 `null`。有歌曲时返回下面的对象：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | string | 歌曲名 |
| `artist` | string | 艺术家 |
| `albumTitle` | string | 专辑名 |
| `albumArtist` | string | 专辑艺术家 |
| `genre` | string | 流派 |
| `composer` | string | 作曲者 |
| `duration` | number | 总时长，单位为秒 |
| `elapsedTime` | number | 获取时的播放位置，单位为秒 |
| `capturedAt` | number | 获取信息时的毫秒时间戳 |
| `playbackRate` | number | 播放速率；暂停时通常为 `0` |
| `state` | string | 播放状态 |
| `repeatMode` | string | 循环模式 |
| `shuffleMode` | string | 随机模式 |
| `queueIndex` | number \| null | 当前歌曲在队列中的索引 |
| `persistentID` | string | 本地媒体资料库 ID |
| `playbackStoreID` | string | Apple Music 商店歌曲 ID；不可用时为空字符串 |
| `trackNumber` / `trackCount` | number | 曲目编号与专辑曲目数 |
| `discNumber` / `discCount` | number | 碟片编号与碟片数 |
| `isExplicit` | boolean | 是否标记为显式内容 |
| `isCloudItem` | boolean | 是否为云端项目 |
| `artworkAvailable` | boolean | 是否有封面 |
| `releaseDate` | number \| null | 发行日期的毫秒时间戳 |

`state` 可能为 `stopped`、`playing`、`paused`、`interrupted`、`seekingForward`、`seekingBackward` 或 `unknown`。

:::tip 小组件展示的是一次快照
小组件的 JavaScript 不会每秒持续运行。需要估算当前进度时，可以结合 `elapsedTime`、`capturedAt` 和 `playbackRate`；实际刷新时机仍由 iOS 决定。
:::

## 获取播放状态

只需要进度和播放模式时，可以避免读取完整歌曲信息：

```js
const playback = await AppleMusic.playbackState()
const progress = playback.elapsedTime
```

返回对象包含 `state`、`capturedAt`、`elapsedTime`、`playbackRate`、`repeatMode`、`shuffleMode` 和 `queueIndex`。

## 获取封面

```js
const artwork = await AppleMusic.artwork(512)
```

参数是正方形封面的边长，单位为点，有效范围会限制在 `32` 到 `1024`。封面会按歌曲 ID 保存到当前小组件的私有缓存，并立即同步到桌面小组件使用的 App Group 运行缓存。返回值是可直接使用的 `LL:` 文件路径；切歌后路径会变化，目录中只保留当前封面文件。当前歌曲没有封面时返回 `null`。

把 Image 的类型设为“文件”，内容设为 `${artwork}`。

封面文件通常比文本数据大。只在布局确实需要封面时调用，并优先使用与实际显示尺寸接近的值。

### 自定义封面名称或路径

`saveArtwork()` 可以指定文件名或完整路径：

```js
// 只传文件名：默认保存到当前小组件的 LL: 私有目录
const privateCover = await AppleMusic.saveArtwork(256, 'current-cover.jpg')

// 传完整路径
const fm = FileManager.local()
const publicPath = fm.documents() + 'music/current-cover.jpg'
const publicCover = await AppleMusic.saveArtwork(256, publicPath)
```

支持 `LD:`、`LL:`、`ID:`、`IL:` 路径，路径仍然只能位于当前小组件目录内。`saveArtwork()` 会覆盖同名文件并立即同步 App Group 运行缓存，但不会自动删除自定义文件；需要时使用 `FileManager.remove(path)` 清理。

## 控制播放

所有控制方法都是异步方法，成功后返回最新的播放状态对象。

`play()`、`pause()`、`togglePlayPause()`、`stop()` 会等待播放状态更新；`next()` 和 `previous()` 会等待歌曲或播放位置发生变化，最长等待约 2.5 秒。因此在 Button 代码中 `await` 命令后，可以立即重新读取歌曲信息。

```js
await AppleMusic.play()
await AppleMusic.pause()
await AppleMusic.togglePlayPause()
await AppleMusic.next()
await AppleMusic.previous()
await AppleMusic.stop()
```

跳转到指定秒数：

```js
await AppleMusic.seek(90)
```

如果指定时间超过当前歌曲时长，会自动限制到歌曲末尾。负数、`NaN` 和无限值会以 `apple_music_invalid_playback_time` 失败。

## 循环与随机模式

```js
await AppleMusic.setRepeatMode('one')
await AppleMusic.setShuffleMode('songs')
```

循环模式支持 `default`、`off`、`one`、`all`；随机模式支持 `default`、`off`、`songs`、`albums`。

## 按 Apple Music 歌曲 ID 播放

```js
await AppleMusic.playStoreID('1440833098')
```

这个方法会用歌曲 ID 替换当前系统播放队列，准备完成后开始播放。歌曲 ID 无效、地区不可用或订阅状态不满足时，Promise 会失败。

## 热门榜单

获取当前地区的热门歌曲、专辑和歌单：

```js
const topSongs = await AppleMusic.topSongs(20, null)
const topAlbums = await AppleMusic.topAlbums(20, null)
const topPlaylists = await AppleMusic.topPlaylists(20, null)
```

第二个参数是可选的 Apple Music 流派 ID。传 `null` 或空字符串时使用全部流派：

```js
const alternativeSongs = await AppleMusic.topSongs(20, '20')
```

获取每日全球歌曲榜：

```js
const globalSongs = await AppleMusic.dailyGlobalTopSongs(50)
```

榜单数量必须在 `1...200` 之间。结果按榜单顺序返回，并自动移除重复 ID。

## 搜索目录

```js
const result = await AppleMusic.search(
  '周杰伦',
  ['songs', 'albums', 'playlists', 'artists'],
  10
)

const firstSong = result.songs[0]
```

类型支持 `songs`、`albums`、`playlists`、`artists`，也接受对应的单数写法。传空数组会搜索全部四种类型。每种类型的数量必须在 `1...25` 之间。

结果按类型分组；没有请求的类型不会出现在对象中：

```js
{
  songs: [],
  albums: [],
  playlists: [],
  artists: []
}
```

## 按 ID 获取详情

```js
const song = await AppleMusic.song('1440833098')
const album = await AppleMusic.album('1440833097')
const playlist = await AppleMusic.playlist('pl.xxxxx')
```

找不到对应内容时返回 `null`。歌曲详情中的 `id` 可以直接传给 `playStoreID()`。

## 目录条目字段

所有目录条目至少包含 `id`、`type`、`name`、`artworkURL` 和 `appleMusicURL`。不同类型还会包含这些字段：

| 类型 | 额外字段 |
| --- | --- |
| `song` | `artistName`、`albumName`、`duration`、`releaseDate`、`genreNames`、`isExplicit`、`composerName`、`trackNumber`、`discNumber`、`hasLyrics`、`isrc` |
| `album` | `artistName`、`trackCount`、`releaseDate`、`genreNames`、`isExplicit`、`recordLabelName`、`isCompilation`、`isSingle` |
| `playlist` | `curatorName`、`description`、`isChart`、`lastModifiedAt` |
| `artist` | `genreNames` |
| `station` | `providerName`、`duration`、`isLive`、`isExplicit` |

`releaseDate` 是 `YYYY-MM-DD` 字符串；`duration` 的单位为秒；`lastModifiedAt` 是毫秒时间戳或 `null`。封面 URL 固定请求 `600 × 600` 图片。

:::warning 目录封面是网络 URL
Image 组件不会直接加载 `artworkURL`。需要显示目录封面时，先用 `FileManager.download()` 保存，再把 Image 类型设为“文件”。
:::

```js
const songs = await AppleMusic.topSongs(10, null)
const fm = FileManager.local()
const coverPath = fm.library() + `catalog-${songs[0].id}.jpg`

if (!fm.fileExists(coverPath)) {
  await fm.download(new Request(songs[0].artworkURL), coverPath)
}

const catalogArtwork = coverPath
```

## 个性化推荐

```js
const recommendations = await AppleMusic.recommendations(10)
```

返回推荐分组数组：

```js
[
  {
    id: '推荐分组 ID',
    title: '为你推荐',
    reason: '',
    nextRefreshAt: 1910000000000,
    items: [] // 专辑、歌单或电台
  }
]
```

`nextRefreshAt` 是毫秒时间戳或 `null`。数量必须在 `1...25` 之间。此接口根据用户的资料库和收听历史生成结果，需要 MusicKit 用户 Token。

## 最近播放

```js
const recent = await AppleMusic.recentlyPlayed(20)

const songs = recent.songs
const albumsPlaylistsAndStations = recent.containers
```

`songs` 是最近播放歌曲；`containers` 包含最近播放的专辑、歌单和电台。数量会分别应用到两组结果，必须在 `1...30` 之间。此接口需要 MusicKit 用户 Token。

## 订阅能力

```js
const musicSubscription = await AppleMusic.subscription()
```

返回：

```js
{
  canPlayCatalogContent: true,
  canBecomeSubscriber: false,
  hasCloudLibraryEnabled: true
}
```

在调用 `playStoreID()` 前，可以先用 `canPlayCatalogContent` 判断当前账户是否允许播放 Apple Music 目录内容。

:::warning 读取范围由系统决定
`AppleMusic` 读取的是系统音乐播放器公开的信息。播放家庭共享资料库中的歌曲时，系统可能仍能返回播放状态，但当前歌曲会是 `null`。
:::

## 速查

```js
AppleMusic.authorizationStatus() → string
AppleMusic.requestAuthorization() → Promise<string>
AppleMusic.nowPlaying() → Promise<object | null>
AppleMusic.playbackState() → Promise<object>
AppleMusic.artwork(size) → Promise<string | null> // LL: 文件路径
AppleMusic.saveArtwork(size, nameOrPath) → Promise<string | null>

AppleMusic.play() → Promise<object>
AppleMusic.pause() → Promise<object>
AppleMusic.togglePlayPause() → Promise<object>
AppleMusic.stop() → Promise<object>
AppleMusic.next() → Promise<object>
AppleMusic.previous() → Promise<object>
AppleMusic.seek(seconds) → Promise<object>
AppleMusic.setRepeatMode(mode) → Promise<object>
AppleMusic.setShuffleMode(mode) → Promise<object>
AppleMusic.playStoreID(storeID) → Promise<object>

AppleMusic.topSongs(limit, genreID) → Promise<object[]>
AppleMusic.topAlbums(limit, genreID) → Promise<object[]>
AppleMusic.topPlaylists(limit, genreID) → Promise<object[]>
AppleMusic.dailyGlobalTopSongs(limit) → Promise<object[]>
AppleMusic.search(term, types, limit) → Promise<object>
AppleMusic.song(id) → Promise<object | null>
AppleMusic.album(id) → Promise<object | null>
AppleMusic.playlist(id) → Promise<object | null>
AppleMusic.recommendations(limit) → Promise<object[]>
AppleMusic.recentlyPlayed(limit) → Promise<object>
AppleMusic.subscription() → Promise<object>
```
