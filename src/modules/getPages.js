const path = require('path')
const glob = require('glob')

const objectDeepMap = require('./objectDeepMap')
const readPages = require('./readPages')
const processIncludes = require('./processIncludes')

const getPages = ({ cwd, contentFolder, indexFile }) => {
  const pagePaths = glob.sync(path.join(cwd, `${contentFolder}/**/${indexFile}`))
  const contentDir = path.join(cwd, contentFolder)

  if (!pagePaths.length) {
    throw new Error(`Cannot find any ${indexFile} files in ${contentFolder}/`)
  }

  // TODO make it return an array
  const pages = readPages({ relativeTo: contentDir, pagePaths })

  for (let pagePath in pages) {
    objectDeepMap(pages[pagePath], (...args) =>
      processIncludes({ pagePath, contentDir }, ...args))
  }

  return pages
}

module.exports = getPages
