const path = require('path')
const glob = require('glob')

const objectDeepMap = require('./modules/objectDeepMap')
const readPages = require('./modules/readPages')
const loadContent = require('./modules/loadContent')

const contentFolder = 'content'
const indexFile = 'index.yml'

const loadList = ({ rootDir, listGlob, pagePath }) => {
  // console.log(glob.sync(listGlob))
  return listGlob
}

const processIncludes = ({ pagePath, contentDir }, key, value) => {
  if (key === 'content') {
    return loadContent({ rootDir: contentDir, contentPath: value, pagePath })
  } else if (key === 'list') {
    return loadList({ rootDir: contentDir, listGlob: value, pagePath })
  }
  return value
}

module.exports = ({ cwd }) => {
  const start = process.hrtime()

  const pagePaths = glob.sync(path.join(cwd, `${contentFolder}/**/${indexFile}`))
  const contentDir = path.join(cwd, contentFolder)

  if (!pagePaths.length) {
    throw new Error(`Cannot find any ${indexFile} files in ${contentFolder}/`)
  }

  const pages = readPages({ relativeTo: contentDir, pagePaths })

  for (let pagePath in pages) {
    objectDeepMap(pages[pagePath], (...args) =>
      processIncludes({ pagePath, contentDir }, ...args))
  }
  // console.log(pages)

  const ms = Math.ceil(process.hrtime(start)[1] / 1e6)
  console.log(`The build process took ${ms}ms`)
}
