const { MergeAudios } = require('./merge-audios.js')
const { MergeShorts } = require('./merge-shorts.js')
const { Output } = require('./output.js')

/**
 * @typedef {Object} Short
 * @property {string} start
 * @property {string} duration
 * @property {string} output
 */

/**
 * @typedef {Object} Video
 * @property {string} url
 * @property {string?} quality
 * @property {Short} shorts
 */

class Combinator {
  /** @type {Output} */
  #config
  /** @type {import('./video.js').Video[]} */
  #videos = []
  /** @type {import('./mosaic.js').Mosaic[]} */
  #mosaics = []
  /** @type {import('./merge-shorts.js').MergeShorts[]} */
  #shortsToMerge = []
  /** @type {import('./merge-audios.js').MergeAudios[]} */
  #audiosToMerge = []

  /** @param {Output?} ouput */
  constructor(output) {
    this.#config = output || new Output()
  }

  /** @param {import('./video.js').Video} video */
  video(video) {
    video.injectOutputUtility(this.#config)
    this.#videos.push(video)
    return this
  }

  /** @param {import('./mosaic.js').Mosaic} mosaic */
  mosaic(mosaic) {
    mosaic.injectOutputUtility(this.#config)
    this.#mosaics.push(mosaic)
    return this
  }

  /** * @param {MergeShorts} short */
  mergeShorts(short) {
    short.injectOutputUtility(this.#config)
    this.#shortsToMerge.push(short)
    return this
  }

  /** @param {MergeAudios} audio */
  mergeAudios(audio) {
    audio.injectOutputUtility(this.#config)
    this.#audiosToMerge.push(audio)
    return this
  }

  async parallel() {
    await Promise.all([
      ...this.#videos.map((video) => video.parallel()),
      ...this.#shortsToMerge.map((short) => short.generate()),
      ...this.#audiosToMerge.map((audio) => audio.generate()),
    ])
    console.log('Process finished!')
  }

  async sequentially() {
    for (const video of this.#videos) {
      await video.sequentially()
    }
    for (const shortToMerge of this.#shortsToMerge) {
      await shortToMerge.generate()
    }
    for (const audioToMerge of this.#audiosToMerge) {
      await audioToMerge.generate()
    }
  }

  async *entries() {
    for (const video of this.#videos) {
      yield await video.sequentially()
    }
    for (const shortToMerge of this.#shortsToMerge) {
      yield await shortToMerge.generate()
    }
    for (const audioToMerge of this.#audiosToMerge) {
      yield await audioToMerge.generate()
    }
  }
}

module.exports = {
  Combinator,
}
