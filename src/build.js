const path = require('path')
const glob = require('glob')

const objectDeepMap = require('./modules/objectDeepMap')
const readPages = require('./modules/readPages')
const processIncludes = require('./modules/processIncludes')

const contentFolder = 'content'
const indexFile = 'index.yml'
const buildFolder = 'build'

const getPages = ({ cwd }) => {
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

const renderAllMarkdown = page => page
const renderComponent = page => '<html></html>'
const getUrl = page => '/test/url'
const writePage = page => page

module.exports = ({ cwd }) => {
  const start = process.hrtime()

  const pages = getPages({ cwd })
  for (pagePath in pages) {
    let current = pages[pagePath]
    renderAllMarkdown(current)
    current.html = renderComponent(current)
    current.url = getUrl(current)
    writePage(current)
  }

  console.log(pages)
  // console.log(JSON.stringify(pages['notes/index.yml'].notes, null, 2))

  const ms = Math.ceil(process.hrtime(start)[1] / 1e6)
  console.log(`The build process took ${ms}ms`)
}
