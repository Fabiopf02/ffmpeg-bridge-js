const { Output } = require('../src/output')
const { mkdirSync } = require('fs')
const path = require('path')

class CustomOutput extends Output {
  #dir = Date.now().toString()

  constructor() {
    super()
    mkdirSync(this.#outputShorts(), { recursive: true })
    mkdirSync(this.#outputAudio(), { recursive: true })
    mkdirSync(this.#outputThumbnail(), { recursive: true })
  }

  /**
   * @param {string?} name
   * @returns {string}
   */
  #outputShorts(name = '') {
    return path.resolve(__dirname, '..', 'output', this.#dir, 'shorts', name)
  }

  /**
   * @param {string?} name
   */
  #outputAudio(name = '') {
    return path.resolve(__dirname, '..', 'output', this.#dir, 'audios', name)
  }

  /**
   * @param {string} name
   * @returns {string}
   */
  #rootOutput(name = '') {
    return path.resolve(__dirname, '..', 'output', this.#dir, name)
  }
  /**
   * @param {string} name
   * @returns {string}
   */
  #outputThumbnail(name = '') {
    return path.resolve(
      __dirname,
      '..',
      'output',
      this.#dir,
      'thumbnails',
      name
    )
  }

  /** @param {import('../src/output').Entry} entry */
  getPath(entry) {
    switch (entry.type) {
      case 'audio':
        return this.#outputAudio(entry.name)
      case 'merge':
        return this.#rootOutput(entry.name)
      case 'mosaic':
        return this.#rootOutput(entry.name)
      case 'short':
        return this.#outputShorts(entry.name)
      case 'thumbnail':
        return this.#outputThumbnail(entry.name)
      default:
        throw new Error('Unknown type: ')
    }
  }
}

module.exports = {
  CustomOutput,
}
