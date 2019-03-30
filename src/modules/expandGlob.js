const glob = require('glob')

const expandGlob = pattern => {
  if (glob.hasMagic(pattern)) {
    return glob.sync(pattern)
  }
  return pattern
}

module.exports = expandGlob
