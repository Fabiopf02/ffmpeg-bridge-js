const { Command } = require('./command.js')
const { Output } = require('./output.js')

/**
 * @typedef {Object} MergeAudio
 * @property {string} output
 * @property {string[]} audios
 */

class MergeAudios {
  /** @type {MergeAudio} */
  #data
  /** @type {import('./output.js').Output} */
  #output
  /** @type  {import('./command.js').Command} */
  #cmd

  /** @param {MergeAudio} data */
  constructor(data, command = new Command(), output = new Output()) {
    this.#output = output
    this.#cmd = command
    this.#data = data
  }

  /** @param {Output} output */
  injectOutputUtility(output) {
    this.#output = output
  }

  /** @param {string[]} names */
  #filterMergeComplexAudios(names) {
    const filter = names.map((_, i) => `[${i}:a]`)
    return {
      paths: names
        .map((name) => this.#output.getPath({ name, type: 'audio' }))
        .join(' -i '),
      filterComplex: `${filter.join('')}concat=n=${names.length}:v=0:a=1[a]`,
    }
  }

  /** @param {MergeAudio} data */
  async #mergeAudio(data) {
    console.log('MERGING AUDIOS...')
    const { paths, filterComplex } = this.#filterMergeComplexAudios(data.audios)
    await this.#cmd
      .arg('-i', paths)
      .arg('-filter_complex', `"${filterComplex}"`)
      .arg('-map', '"[a]"')
      .arg(this.#output.getPath({ name: data.output, type: 'merge' }))
      .exec()
  }

  async generate() {
    this.#mergeAudio(this.#data)
  }
}

module.exports = {
  MergeAudios,
}
