const getPages = require('./modules/getPages')

const contentFolder = 'content'
const indexFile = 'index.yml'

const renderComponent = page => '<html></html>'
const writePage = page => page

module.exports = ({ cwd }) => {
  const start = process.hrtime()

  const pages = getPages({ cwd, contentFolder, indexFile })
  for (pagePath in pages) {
    let current = pages[pagePath]
    current.html = renderComponent(current)
    current.htmlPath = pagePath.replace('.yml', '.html')
    writePage(current)
  }

  console.log(pages)
  // console.log(JSON.stringify(pages['notes/index.yml'].notes, null, 2))

  const ms = Math.ceil(process.hrtime(start)[1] / 1e6)
  console.log(`The build process took ${ms}ms`)
}
