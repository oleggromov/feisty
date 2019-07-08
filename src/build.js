const getPages = require('./modules/get-pages')
const { cleanDir, writePage } = require('./modules/fs-utils')

module.exports = async ({ cwd }) => {
  const start = process.hrtime()

  const pages = getPages({ cwd,
    contentFolder: 'pages',
    indexFile: 'index.yml'
  })

  cleanDir({ cwd, folder: 'build' })

  for (page in pages) {
    console.log(`Writing ${page}...`)
    writePage({ cwd, buildFolder: 'build' }, {
      path: page.replace(/\.yml$/, '.json'),
      data: JSON.stringify(pages[page], null, 2)
    })
  }

  const ms = Math.ceil(process.hrtime(start)[1] / 1e6)
  console.log(`The build process took ${ms}ms`)
}
