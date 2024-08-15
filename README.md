# ffmpeg-bridge-js

> A bridge between `ffmpeg` and `Node/JS` with a simplified usage interface

> ! Initially implemented for use with YouTube url's!

##### _Documentation in progress_

[Full usage example](./example/usage.example.js)

### Video
### Launch instance
```js
const videoInstance = new Video(
  {
    url: 'https://www.youtube.com/...',
    quality: 'bestvideo[height>1080]+bestaudio[height>1080]/best', // Optional parameter
  },
)
```

### Include the generation of a video cut
```js
videoInstance.short({
  start: '00:00:00',
  end: '00:00:10',
  output: 'short1.mp4'
})
```

#### This can be done for more than one cut

```js
videoInstance.short(...).short(...)
```

#### And finally get the result
```js
// to perform all cuts at the same time (uses more resources)
videoInstance.parallel()

// or do it one by one (lighter)
videoInstance.sequentially()
```

### Audio
The `Video` class also allows you to cut just the `audio`:
```js
videoInstance.audio({
  start: '00:00:00',
  end: '00:00:10',
  output: 'short1.mp4'
})
```
#### And it can be combined with `short`
```js
videoInstance.short({
  start: '00:00:31',
  end: '00:00:40',
  output: 'short4.mp4',
})
.audio({ start: '00:00:00', end: '00:00:15', output: 'audio2.aac' })
```


