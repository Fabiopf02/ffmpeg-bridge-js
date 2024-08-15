const { Command } = require('./command.js')
const { Output } = require('./output.js')
const { generateFilterComplex } = require('./shared.js')

/**
 * @typedef {Object} MergeShort
 * @property {string} output format: name.ext
 * @property {string[]} shorts format: ['name.ext']
 */

class MergeShorts {
  /** @type {MergeShort[]} */
  #data = []
  /** @type {import('./output.js').Output} */
  #output
  /** @type {import('./command.js').Command} */
  #cmd

  /** * @param {MergeShort} data */
  constructor(data, command = new Command(), output = new Output()) {
    this.#output = output
    this.#data = data
    this.#cmd = command
  }

  /** @param {Output} output */
  injectOutputUtility(output) {
    this.#output = output
  }

  /** @param {MergeShort} data */
  async #mergeShort(data) {
    console.log('MERGING SHORTS...')
    const { paths, filterComplex } = generateFilterComplex(data.shorts)
    await this.#cmd
      .arg('-i', paths)
      .arg('-filter_complex', `"${filterComplex}"`)
      .arg('-map', '"[outv]"')
      .arg('-map', '"[outa]"')
      .arg(this.#output.getPath({ name: data.output, type: 'merge' }))
      .exec()
  }

  async generate() {
    this.#mergeShort(this.#data)
  }
}

module.exports = {
  MergeShorts,
}
