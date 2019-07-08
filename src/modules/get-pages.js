const path = require('path')
const glob = require('glob')

const objectDeepMap = require('./object-deep-map')
const readPages = require('./read-pages')
const processIncludes = require('./process-includes')

const getPages = ({ cwd, contentFolder, indexFile }) => {
  const pagePaths = glob.sync(path.join(cwd, `${contentFolder}/**/${indexFile}`))
  const contentDir = path.join(cwd, contentFolder)

  // TODO make it return an array
  const pages = readPages({ relativeTo: contentDir, pagePaths })
  const processed = {}

  for (let pagePath in pages) {
    processed[pagePath] = objectDeepMap(pages[pagePath], (...args) =>
      processIncludes({ pagePath, contentDir }, ...args))
  }

  return processed
}

module.exports = getPages
