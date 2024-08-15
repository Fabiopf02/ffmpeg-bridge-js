const { Command } = require('./command.js')
const { Output } = require('./output.js')
const { generateFilterComplex } = require('./shared.js')

/**
 * @typedef {Object} TMosaic
 * @property {string} output
 * @property {string} scale widthxheight
 * @property {string[]} shorts
 */

class Mosaic {
  /** @type {TMosaic} */
  #data
  /** @type {import('./output.js').Output} */
  #output
  /** @param {import('./command.js').Command} command */
  #cmd

  /** @param {TMosaic} data */
  constructor(data, command = new Command(), output = new Output()) {
    this.#cmd = command
    this.#output = output
    this.#data = data
  }

  /** @param {Output} output */
  injectOutputUtility(output) {
    this.#output = output
  }

  /**
   * @param {number} number
   * @param {string} mosaicScale
   */
  #getScales(points, mosaicScale) {
    const [width, height] = mosaicScale.split('x').map(Number)
    if (points === 2) return { width: parseInt(width / 2), height }
    if (points === 3) return { width: parseInt(width / 3), height }
    return { width: parseInt(width / 2), height: parseInt(height / 2) }
  }
  /**
   * @param {number} width
   * @param {number} height
   */
  #getPositions(width, height) {
    return [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: 0, y: height },
      { x: width, y: height },
    ]
  }

  /** @param {TMosaic} mosaic */
  async #generateMosaic(mosaic) {
    console.log('GENERATING MOSAIC...')
    const { width, height } = this.#getScales(
      mosaic.shorts.length,
      mosaic.scale
    )
    const { paths } = generateFilterComplex(mosaic.shorts)
    const positions = this.#getPositions(width, height)
    let overlayCommands = `[base][${mosaic.shorts[0]}] overlay=shortest=1 [tmp1]; `
    const filterComplex = mosaic.shorts
      .map((short, i, list) => {
        const { x, y } = positions[i]
        if (i > 0) {
          const tmp = i + 1 === list.length ? '' : `[tmp${i + 1}];`
          overlayCommands += `[tmp${i}][${short}] overlay=shortest=1:x=${x}:y=${y} ${tmp} `
        }
        return `[${i}:v] setpts=PTS-STARTPTS, scale=${width}x${height} [${short}];`
      })
      .join(' ')

    await this.#cmd
      .arg('-i', paths)
      .arg(
        '-filter_complex',
        `
        " \
          nullsrc=size=${mosaic.scale} [base]; \
          ${filterComplex} \
          ${overlayCommands} \
        " \
        `
      )
      .arg('-c:v', 'libx264')
      .arg('-an')
      .arg(this.#output.getPath({ name: mosaic.output, type: 'mosaic' }))
      .exec()
  }

  generate() {
    this.#generateMosaic(this.#data)
  }
}

module.exports = {
  Mosaic,
}
