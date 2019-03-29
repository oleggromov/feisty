const EventEmitter = require('events')
const minimatch = require('minimatch')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const flatten = require('./flatten')

const expandGlob = pattern => {
  if (glob.hasMagic(pattern)) {
    return glob.sync(pattern)
  }
  return pattern
}

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
    files.forEach(this.emitFirstMatch.bind(this))
  }

  emitFirstMatch(file) {
    const name = path.parse(file).base
    for (let pattern of this.patterns) {
      if (minimatch(name, pattern)) {
        this.emit(pattern, { file })
        break
      }
    }
  }
}

module.exports = FileReader
