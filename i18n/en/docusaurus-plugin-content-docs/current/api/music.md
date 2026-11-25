---
sidebar_position: 9
---

# Apple Music

`AppleMusic` reads and controls the system Music app, and queries Apple Music charts, songs, albums, playlists, recommendations, and recently played content. Playback controls operate on the user's current system player; they don't create a separate playback queue inside Omni Widgets.

## First-time authorization

Check and request access from the code editor in the main app first:

```js
let musicAuthorization = AppleMusic.authorizationStatus()

if (musicAuthorization === 'notDetermined') {
  musicAuthorization = await AppleMusic.requestAuthorization()
}
```

`authorizationStatus()` may return `notDetermined`, `denied`, `restricted`, or `authorized`.

:::warning The authorization prompt requires the main app
Calling `requestAuthorization()` during a widget refresh fails with `apple_music_authorization_requires_app`. Open Omni Widgets and run the authorization code once in the code editor first. When the user denies or restricts access, the other async APIs fail with `apple_music_not_authorized`.
:::

:::warning Catalog APIs also require the MusicKit App Service
In Apple Developer's Certificates, Identifiers & Profiles, enable the MusicKit App Service for `com.eilgnaw.AWidget`. To request charts or recommendations directly during a Home Screen widget refresh, enable it for `com.eilgnaw.AWidget.AWidgetExtension` too. MusicKit uses the Bundle ID to generate the developer token for catalog requests automatically; this setting doesn't belong in the entitlements file.
:::

## Get the current song

```js
const song = await AppleMusic.nowPlaying()

const title = song?.title ?? 'Nothing playing'
const artist = song?.artist ?? ''
const album = song?.albumTitle ?? ''
const isPlaying = song?.state === 'playing'
```

It returns `null` when there's no current song. Otherwise, it returns this object:

| Field | Type | Description |
| --- | --- | --- |
| `title` | string | Song title |
| `artist` | string | Artist |
| `albumTitle` | string | Album title |
| `albumArtist` | string | Album artist |
| `genre` | string | Genre |
| `composer` | string | Composer |
| `duration` | number | Total duration in seconds |
| `elapsedTime` | number | Playback position in seconds when fetched |
| `capturedAt` | number | Millisecond timestamp when the information was fetched |
| `playbackRate` | number | Playback rate; usually `0` while paused |
| `state` | string | Playback state |
| `repeatMode` | string | Repeat mode |
| `shuffleMode` | string | Shuffle mode |
| `queueIndex` | number \| null | Current song's index in the queue |
| `persistentID` | string | Local media library ID |
| `playbackStoreID` | string | Apple Music store song ID; an empty string when unavailable |
| `trackNumber` / `trackCount` | number | Track number and album track count |
| `discNumber` / `discCount` | number | Disc number and disc count |
| `isExplicit` | boolean | Whether the item is marked explicit |
| `isCloudItem` | boolean | Whether this is a cloud item |
| `artworkAvailable` | boolean | Whether artwork is available |
| `releaseDate` | number \| null | Release date as a millisecond timestamp |

`state` may be `stopped`, `playing`, `paused`, `interrupted`, `seekingForward`, `seekingBackward`, or `unknown`.

:::tip A widget displays a snapshot
A widget's JavaScript doesn't run continuously every second. To estimate current progress, combine `elapsedTime`, `capturedAt`, and `playbackRate`; iOS still decides when the widget actually refreshes.
:::

## Get playback state

When you only need progress and playback modes, avoid reading the complete song object:

```js
const playback = await AppleMusic.playbackState()
const progress = playback.elapsedTime
```

The returned object contains `state`, `capturedAt`, `elapsedTime`, `playbackRate`, `repeatMode`, `shuffleMode`, and `queueIndex`.

## Get artwork

```js
const artwork = await AppleMusic.artwork(512)
```

The argument is the square artwork's side length in points, clamped from `32` through `1024`. The artwork is saved in the current widget's private cache, and the method returns a ready-to-use `LL:` file path, or `null` when the current song has no artwork.

Set the Image type to **File** and its content to `${artwork}`.

Artwork files are usually much larger than text data. Call this only when the layout needs artwork, and prefer a value close to the actual display size.

## Control playback

Every control is asynchronous and returns the latest playback-state object when it succeeds.

```js
await AppleMusic.play()
await AppleMusic.pause()
await AppleMusic.togglePlayPause()
await AppleMusic.next()
await AppleMusic.previous()
await AppleMusic.stop()
```

Seek to a position in seconds:

```js
await AppleMusic.seek(90)
```

If the requested time exceeds the current song's duration, it's clamped to the end. Negative numbers, `NaN`, and infinite values fail with `apple_music_invalid_playback_time`.

## Repeat and shuffle modes

```js
await AppleMusic.setRepeatMode('one')
await AppleMusic.setShuffleMode('songs')
```

Repeat accepts `default`, `off`, `one`, and `all`. Shuffle accepts `default`, `off`, `songs`, and `albums`.

## Play by Apple Music song ID

```js
await AppleMusic.playStoreID('1440833098')
```

This replaces the current system playback queue with the song ID and starts playback after preparation finishes. The Promise fails when the ID is invalid, the song isn't available in the current storefront, or the subscription doesn't allow playback.

## Popular charts

Get popular songs, albums, and playlists for the current storefront:

```js
const topSongs = await AppleMusic.topSongs(20, null)
const topAlbums = await AppleMusic.topAlbums(20, null)
const topPlaylists = await AppleMusic.topPlaylists(20, null)
```

The second argument is an optional Apple Music genre ID. Pass `null` or an empty string for all genres:

```js
const alternativeSongs = await AppleMusic.topSongs(20, '20')
```

Get the daily global songs chart:

```js
const globalSongs = await AppleMusic.dailyGlobalTopSongs(50)
```

The chart limit must be within `1...200`. Results preserve chart order and automatically remove duplicate IDs.

## Search the catalog

```js
const result = await AppleMusic.search(
  'Taylor Swift',
  ['songs', 'albums', 'playlists', 'artists'],
  10
)

const firstSong = result.songs[0]
```

Supported types are `songs`, `albums`, `playlists`, and `artists`; their singular forms also work. Pass an empty array to search all four types. The per-type limit must be within `1...25`.

Results are grouped by type. Types you didn't request aren't present:

```js
{
  songs: [],
  albums: [],
  playlists: [],
  artists: []
}
```

## Get details by ID

```js
const song = await AppleMusic.song('1440833098')
const album = await AppleMusic.album('1440833097')
const playlist = await AppleMusic.playlist('pl.xxxxx')
```

These methods return `null` when the content isn't found. You can pass a song detail's `id` directly to `playStoreID()`.

## Catalog item fields

Every catalog item contains at least `id`, `type`, `name`, `artworkURL`, and `appleMusicURL`. Each type also includes these fields:

| Type | Additional fields |
| --- | --- |
| `song` | `artistName`, `albumName`, `duration`, `releaseDate`, `genreNames`, `isExplicit`, `composerName`, `trackNumber`, `discNumber`, `hasLyrics`, `isrc` |
| `album` | `artistName`, `trackCount`, `releaseDate`, `genreNames`, `isExplicit`, `recordLabelName`, `isCompilation`, `isSingle` |
| `playlist` | `curatorName`, `description`, `isChart`, `lastModifiedAt` |
| `artist` | `genreNames` |
| `station` | `providerName`, `duration`, `isLive`, `isExplicit` |

`releaseDate` is a `YYYY-MM-DD` string, `duration` is in seconds, and `lastModifiedAt` is a millisecond timestamp or `null`. Artwork URLs request a fixed `600 × 600` image.

:::warning Catalog artwork is a network URL
The Image component doesn't load `artworkURL` directly. To display catalog artwork, save it with `FileManager.download()` first, then set the Image type to **File**.
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

## Personal recommendations

```js
const recommendations = await AppleMusic.recommendations(10)
```

It returns an array of recommendation groups:

```js
[
  {
    id: 'recommendation group ID',
    title: 'Made for You',
    reason: '',
    nextRefreshAt: 1910000000000,
    items: [] // albums, playlists, or stations
  }
]
```

`nextRefreshAt` is a millisecond timestamp or `null`. The limit must be within `1...25`. This API uses the user's library and listening history, and requires a MusicKit user token.

## Recently played

```js
const recent = await AppleMusic.recentlyPlayed(20)

const songs = recent.songs
const albumsPlaylistsAndStations = recent.containers
```

`songs` contains recently played songs. `containers` contains recently played albums, playlists, and stations. The limit applies separately to both groups and must be within `1...30`. This API requires a MusicKit user token.

## Subscription capabilities

```js
const musicSubscription = await AppleMusic.subscription()
```

It returns:

```js
{
  canPlayCatalogContent: true,
  canBecomeSubscriber: false,
  hasCloudLibraryEnabled: true
}
```

Before calling `playStoreID()`, check `canPlayCatalogContent` to see whether the current account can play Apple Music catalog content.

:::warning The system decides what's readable
`AppleMusic` reads information exposed by the system music player. While a Home Sharing library item is playing, the system may still return playback state, but the current song can be `null`.
:::

## Quick reference

```js
AppleMusic.authorizationStatus() → string
AppleMusic.requestAuthorization() → Promise<string>
AppleMusic.nowPlaying() → Promise<object | null>
AppleMusic.playbackState() → Promise<object>
AppleMusic.artwork(size) → Promise<string | null> // LL: file path

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
