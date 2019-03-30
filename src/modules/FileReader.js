const path = require('path')
const promisify = require('util').promisify
const readFile = promisify(require('fs').readFile)
const EventEmitter = require('events')
const minimatch = require('minimatch')
const flatten = require('./flatten')
const expandGlob = require('./expandGlob')

class FileReader extends EventEmitter {
  constructor({ baseDir }) {
    super()
    this.baseDir = baseDir
    this.patterns = []
  }

  on(pattern, cb) {
    super.on(pattern, cb)
    this.patterns.push(pattern)
  }

  read(...patterns) {
    const files = flatten(patterns.map(expandGlob))
    files.forEach(file => this.emitFirstMatch(file))
  }

  async emitFirstMatch(file) {
    const name = path.parse(file).base
    const fullPath = path.join(this.baseDir, file)
    for (let pattern of this.patterns) {
      if (minimatch(name, pattern)) {
        try {
          const content = await readFile(fullPath, 'utf8')
          this.emit(pattern, { file, content })
        } catch (err) {
          this.emit('error', err)
        }
        break
      }
    }
  }
}

module.exports = FileReader
