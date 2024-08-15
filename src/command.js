const { exec } = require('./utils')

class Command {
  #cmd = {}

  /**
   * @param {string} name
   * @param {string?} value
   */
  arg(name, value) {
    this.#cmd[name] = value
    return this
  }

  toObject() {
    return this.#cmd
  }

  toArray() {
    const commandArr = []
    for (const [argName, argValue] of Object.entries(this.#cmd)) {
      if (argName) commandArr.push(argName)
      if (argValue) commandArr.push(argValue)
    }
    return commandArr
  }

  toString() {
    let commandStr = ''
    Object.entries(this.#cmd).forEach(([argName, argValue]) => {
      commandStr += `${argName}${argValue ? ` ${argValue} ` : ''}\ `
    })
    return commandStr.trim()
  }

  async exec() {
    await exec('ffmpeg ' + this.toString())
  }
}

module.exports = {
  Command,
}
