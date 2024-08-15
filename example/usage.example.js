const { Combinator, Command, Video, VideoSizes } = require('../src')
const { CustomOutput } = require('./utility.example.js')

const combinator = new Combinator(new CustomOutput())
class CustomCommand extends Command {
  // exec() {
  //   console.log('executing...')
  // }
}

combinator
  .video(
    new Video(
      {
        url: 'https://www.youtube.com/...',
        quality: 'bestvideo[height>1080]+bestaudio[height>1080]/best',
      },
      new CustomCommand()
    )
      .short({
        start: '00:00:00',
        end: '00:00:10',
        output: 'short1.mp4',
        size: VideoSizes['hd1080'],
      })
      .short({
        start: '00:00:11',
        end: '00:00:20',
        output: 'short2.mp4',
        size: VideoSizes['hd1080'],
      })
      .audio({ start: '00:00:00', end: '00:00:15', output: 'audio1.aac' })
      .thumbnail('thumb1')
  )
  .video(
    new Video({
      url: 'https://www.youtube.com/...',
      quality: 'bestvideo[height>1080]+bestaudio[height>1080]/best',
    })
      .short({
        start: '00:00:21',
        end: '00:00:30',
        output: 'short3.mp4',
        size: VideoSizes['hd1080'],
      })
      .short({
        start: '00:00:31',
        end: '00:00:40',
        output: 'short4.mp4',
        size: VideoSizes['hd1080'],
      })
      .audio({ start: '00:00:00', end: '00:00:15', output: 'audio2.aac' })
      .thumbnail('thumb2')
  )
  .parallel()
