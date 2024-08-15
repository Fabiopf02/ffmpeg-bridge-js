/** @param {string[]} names */
function generateFilterComplex(names) {
  let partialFilterComplex = ''
  const paths = names
    .map((name, index) => {
      partialFilterComplex += `[${index}:v:0][${index}:a:0]`
      return this.outputShorts(name)
    })
    .join(' -i ')
  return {
    paths,
    filterComplex: `${partialFilterComplex}concat=n=${names.length}:v=1:a=1[outv][outa]`,
  }
}

module.exports = {
  generateFilterComplex,
}
