const { Command } = require('./command.js')
const { Output } = require('./output.js')
const { exec } = require('./utils')

const DEFAULT_YT_QUALITY =
  'bestvideo[height>=1080]+bestaudio[height>=1080]/best'

/**
 * @typedef {Object} Short
 * @property {string} start
 * @property {string} end format: 00:00:00
 * @property {string} output format: name.ext
 * @property {string} size widthxheight
 * @property {('ultrafast'|'superfast'|'veryfast'|'faster'|'fast'|'medium'|'slow'|'slower'|'veryslow')?} preset
 * @property {number?} bitRate in Mbps
 * @property {number?} crf Constant Rate Factor. Valid range is 0 to 63. Higher numbers indicating lower quality and smaller output size
 */

/**
 * @typedef {Object} TVideo
 * @property {string} url
 * @property {string?} quality
 */

/**
 * @typedef {Object} TAudio
 * @property {string} start format: 00:00:00
 * @property {string} end format: 00:00:00
 * @property {string} output format: name.ext
 */

class Video {
  /** @type {string} */
  #source = ''
  /** @type {string} */
  #quality = ''
  /** @type {Short[]} */
  #shorts = []
  /** @type {TAudio[]} */
  #audios = []
  /** @type {import('./output.js').Output} */
  #output
  #originalUrl
  #thumbnailName
  /** @type {import('./command.js').Command} */
  #cmd

  /** @param {TVideo} video */
  constructor(video, command = new Command(), output = new Output()) {
    const quality = 'quality' in video ? video.quality : DEFAULT_YT_QUALITY
    this.#cmd = command
    this.#output = output
    this.#quality = ` -f '${quality}' `
    this.#originalUrl = video.url
    this.#source = `"$(yt-dlp --audio-quality 0${this.#quality}-g '${
      video.url
    }')"`
  }

  /** @param {Output} output */
  injectOutputUtility(output) {
    this.#output = output
  }

  getShortsNames() {
    return this.#shorts.map((short) => short.output)
  }

  /**
   * @param {Short} data
   */
  short(data) {
    this.#shorts.push({
      ...data,
      size: 'size' in data ? data.size : '1920x1080',
      preset: 'preset' in data ? data.preset : 'medium',
      bitRate: 'bitRate' in data ? data.bitRate : 2,
      crf: 'crf' in data ? data.crf : 18,
    })
    return this
  }

  /**
   * @param {TAudio} audio
   */
  audio(audio) {
    this.#audios.push(audio)
    return this
  }

  /** @param {string} name */
  thumbnail(name) {
    this.#thumbnailName = name
    return this
  }

  /** @param {Short} short */
  async #genShort(short) {
    console.log(
      `GENERATING SHORT: ${short.output} (${short.start} | ${short.end})`
    )
    await this.#cmd
      .arg('-ss', short.start)
      .arg('-i', this.#source)
      .arg('-t', short.end)
      .arg('-c:v', 'libx264')
      .arg('-b:v', `${short.bitRate}M`)
      .arg('-preset', short.preset)
      .arg('-crf', short.crf)
      .arg('-s', short.size)
      .arg('-map', '0:v:0')
      .arg('-map', '0:a:0')
      .arg('-shortest')
      .arg(this.#output.getPath({ name: short.output, type: 'short' }))
      .exec()
  }

  async #extractThumbnail() {
    if (!this.#thumbnailName) return
    const output = this.#output.getPath({
      name: `${this.#thumbnailName}.%(ext)s`,
      type: 'thumbnail',
    })
    await exec(
      `yt-dlp --write-thumbnail --skip-download -o "${output}"${
        this.#quality
      }"${this.#originalUrl}"`
    )
  }

  /** @param {TAudio} audio */
  async #genAudio(audio) {
    console.log(
      `GENERATING AUDIO: ${audio.output} (${audio.start} | ${audio.end})`
    )
    await this.#cmd
      .arg('-ss', audio.start)
      .arg('-i', this.#source)
      .arg('-t', audio.end)
      .arg('-c:a', 'aac')
      .arg('-preset', 'fast')
      .arg('-b:a', '320k')
      .arg('-ar', '48000')
      .arg('-vn')
      .arg(this.#output.getPath({ name: audio.output, type: 'audio' }))
      .exec()
    return this
  }

  async parallel() {
    await Promise.all([
      ...this.#shorts.map((short) => this.#genShort(short)),
      ...this.#audios.map((audio) => this.#genAudio(audio)),
      this.#extractThumbnail(),
    ])
  }

  async sequentially() {
    for (const short of this.#shorts) {
      await this.#genShort(short)
    }
    for (const audio of this.#audios) {
      await this.#genAudio(audio)
    }
    await this.#extractThumbnail()
  }

  async *entries() {
    for (const short of this.#shorts) {
      yield await this.#genShort(short)
    }
    for (const audio of this.#audios) {
      yield await this.#genAudio(audio)
    }
    yield await this.#extractThumbnail()
  }
}

module.exports = {
  Video,
}
