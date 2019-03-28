const madge = require('madge')

module.exports = async ({ entries, baseDir }) => madge(entries, { baseDir })
  .then(res => Object.keys(res.obj()).filter(dep => dep.match(/.css$/)))
