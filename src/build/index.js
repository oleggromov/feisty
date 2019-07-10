const { cleanDir, writeFile } = require('../modules/fs-utils')
const getPages = require('./get-pages')
const { bundleServer, bundleClient } = require('./bundle')
const ssrTemplate = require('./ssr-template')
const bundleTemplate = require('./bundle-template')
const { readYaml } = require('../modules/read')
const objectDeepMap = require('../modules/object-deep-map')
const path = require('path')

module.exports = async ({ cwd }) => {
  const buildFolder = path.join(cwd, 'build')
  const tmpFolder = path.join(cwd, '.feisty')
  cleanDir(buildFolder)
  cleanDir(tmpFolder)

  const start = process.hrtime()
  const pages = getPages({ rootDir: path.join(cwd, 'content/pages') })

  pages.forEach(page => {
    writeFile({
      filename: path.join(tmpFolder, 'json', page.meta.writePath),
      content: JSON.stringify(page, null, 2)
    })
  })

  const pageComponents = objectDeepMap(
    readYaml(`${cwd}/components/pages.yml`),
    (key, value) => `../../components/${value}`
  )

  for (let page in pageComponents) {
    const clientBundle = bundleTemplate(pageComponents[page])
    writeFile({
      filename: path.join(tmpFolder, 'bundles', `${page}.js`),
      content: clientBundle
    })
  }

  const bundles = await bundleClient({
    sources: path.join(tmpFolder, 'bundles/*.js'),
    outDir: path.join(buildFolder, '_static')
  })
  const pageBundles = objectDeepMap(
    bundles,
    (key, value) => `../_static/${value}`
  )

  const jsSource = ssrTemplate(pages, pageComponents, pageBundles)
  writeFile({
    filename: path.join(tmpFolder, 'ssr/ssr.js'),
    content: jsSource
  })

  const bundledSsr = await bundleServer({
    source: path.join(tmpFolder, 'ssr/ssr.js'),
    outDir: path.join(tmpFolder, 'parcel')
  })

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
