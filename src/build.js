const path = require('path')
const glob = require('glob')
const { cleanDir, writePage } = require('./modules/fs-utils')
const createSourceTree = require('./modules/create-source-tree')

module.exports = ({ cwd }) => {
  const pageDir = `${cwd}/content/pages`
  const start = process.hrtime()

  // ToDo: add checks here
  const common = createSourceTree(`${pageDir}/common.yml`)
  const pages = glob.sync(`${pageDir}/**/index.yml`)
    .map(fullPath => ({
      meta: {
        sourcePath: fullPath,
        writePath: path.relative(pageDir, fullPath).replace(/\.yml$/, '.json'),
        url: path.relative(pageDir, fullPath)
          .replace(/(\/)?index.yml/, '/')
          .replace(/^(\/)?/, '/')
      },
      data: createSourceTree(fullPath),
      common: common
    }))

  cleanDir({ cwd, folder: 'build' })

  pages.forEach(page => {
    console.log(`Writing ${page.meta.writePath}...`)
    writePage({ cwd, buildFolder: 'build' }, {
      path: page.meta.writePath,
      data: JSON.stringify(page, null, 2)
    })
  })

  const ms = Math.ceil(process.hrtime(start)[1] / 1e6)
  console.log(`The build process took ${ms}ms`)
}
