const { cleanDir, writeFile } = require('../modules/fs-utils')
const getPages = require('./get-pages')
const bundle = require('./bundle')
const ssrTemplate = require('./ssr-template')
const { readYaml } = require('../modules/read')
const objectDeepMap = require('../modules/object-deep-map')
const path = require('path')

module.exports = async ({ cwd }) => {
  const buildFolder = path.join(cwd, 'build')
  const tmpFolder = path.join(cwd, '.feisty')

  const start = process.hrtime()
  const pages = getPages({ rootDir: path.join(cwd, 'content/pages') })

  cleanDir(tmpFolder)
  pages.forEach(page => {
    writeFile({
      filename: path.join(tmpFolder, 'json', page.meta.writePath),
      content: JSON.stringify(page, null, 2)
    })
  })

  const pageComponentMap = objectDeepMap(
    readYaml(`${cwd}/components/pages.yml`),
    (key, value) => `../../components/${value}`
  )

  const jsSource = ssrTemplate(pages, pageComponentMap)
  writeFile({
    filename: path.join(tmpFolder, 'ssr/ssr.js'),
    content: jsSource
  })

  const bundledSsr = await bundle({
    source: path.join(tmpFolder, 'ssr/ssr.js'),
    outDir: path.join(tmpFolder, 'parcel')
  })

  cleanDir(buildFolder)
  for (let key in bundledSsr) {
    const pagePath = key.replace(/\.json$/, '.html')
    console.log(`Writing ${pagePath}...`)
    writeFile({
      filename: path.join(buildFolder, pagePath),
      content: bundledSsr[key]()
    })
  }

  const ms = Math.ceil(process.hrtime(start)[1] / 1e6)
  console.log(`The build process took ${ms}ms`)
}
