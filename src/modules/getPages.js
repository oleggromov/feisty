const path = require('path')
const glob = require('glob')

const objectDeepMap = require('./objectDeepMap')
const readPages = require('./readPages')
const processIncludes = require('./processIncludes')

const getPages = ({ cwd, pattern }) => {
  const absPath = path.join(cwd, pattern)
  const pagePaths = glob.sync(absPath)
  const contentDir = path.parse(absPath).dir.replace(/\*\*$/, '')

  // TODO make it return an array
  const pages = readPages({ relativeTo: contentDir, pagePaths })

  for (let pagePath in pages) {
    objectDeepMap(pages[pagePath], (...args) =>
      processIncludes({ pagePath, contentDir }, ...args))
  }

  return pages
}

module.exports = getPages
