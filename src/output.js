/**
 * @typedef {Object} Entry
 * @property {'short'|'audio'|'mosaic'|'merge'|'thumbnail'} type
 * @property {string} name
 */

class Output {
  /**
   * @param {Entry} entry
   */
  getPath(entry) {
    return entry.name
  }
}

module.exports = {
  Output,
}
