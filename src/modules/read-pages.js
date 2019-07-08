const path = require('path')
const { readYaml } = require('./read-content')

const readPages = ({ relativeTo, pagePaths }) =>
  pagePaths.reduce((acc, pagePath) => {
    const key = path.relative(relativeTo, pagePath)
    acc[key] = readYaml(pagePath)
    return acc
  }, {})

module.exports = readPages
