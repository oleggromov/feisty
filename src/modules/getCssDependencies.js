const madge = require('madge')

module.exports = async ({ entries }) => madge(entries).then(res =>
  Object.keys(res.obj()).filter(dep => dep.match(/.css$/))
)
