const path = require('path')
const getPages = require('./modules/getPages')
const renderComponent = require('./modules/renderComponent')
const { cleanDir, writePage } = require('./modules/fsUtils')

module.exports = ({ cwd }) => {
  const start = process.hrtime()

  const pages = getPages({ cwd,
    contentFolder: 'content',
    indexFile: 'index.yml'
  })

  cleanDir({ cwd, folder: 'build' })
  for (pagePath in pages) {
    let current = pages[pagePath]
    current.htmlPath = pagePath.replace('.yml', '.html')
    current.html = renderComponent({ componentDir: path.resolve(cwd, 'components') }, current)
    writePage({ cwd, buildFolder: 'build' }, current)
    break
  }

  // console.log(pages)
  // console.log(JSON.stringify(pages['notes/index.yml'].notes, null, 2))

  const ms = Math.ceil(process.hrtime(start)[1] / 1e6)
  console.log(`The build process took ${ms}ms`)
}
