const { cleanDir, writeFile, copyFile } = require('../modules/fs-utils')
const getPages = require('./get-pages')
const { bundleServer, bundleClient } = require('./bundle')
const ssrTemplate = require('./ssr-template')
const bundleTemplate = require('./bundle-template')
const { readYaml } = require('../modules/read')
const objectDeepMap = require('../modules/object-deep-map')
const path = require('path')

module.exports = async ({ cwd }) => {
  const start = process.hrtime()

  const pagesRootDir = path.join(cwd, 'content/pages')
  const buildFolder = path.join(cwd, 'build')
  const tmpFolder = path.join(cwd, '.feisty')
  cleanDir(buildFolder)
  cleanDir(tmpFolder)

  const foundImages = {}
  const pages = getPages({ rootDir: pagesRootDir, foundImages })

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
    const bundlePath = path.join(tmpFolder, 'bundles', `${page}.js`)
    console.log(`Client bundle ${bundlePath}...`)
    writeFile({
      filename: bundlePath,
      content: clientBundle
    })
  }

  console.log('Processing all client bundles...')
  const bundles = await bundleClient({
    sources: path.join(tmpFolder, 'bundles/*.js'),
    outDir: path.join(buildFolder, 'assets')
  })
  const pageBundles = objectDeepMap(
    bundles,
    (key, value) => `../assets/${value}`
  )

  const jsSource = ssrTemplate(pages, pageComponents, pageBundles)
  const ssrPath = path.join(tmpFolder, 'ssr/ssr.js')
  console.log(`SSR template ${ssrPath}...`)
  writeFile({
    filename: ssrPath,
    content: jsSource
  })

  console.log('Processing server bundle...')
  const bundledSsr = await bundleServer({
    source: path.join(tmpFolder, 'ssr/ssr.js'),
    outDir: path.join(tmpFolder, 'rollup')
  })

  for (let key in bundledSsr) {
    const pagePath = key.replace(/\.json$/, '.html')
    console.log(`Writing ${pagePath}...`)
    writeFile({
      filename: path.join(buildFolder, pagePath),
      content: await bundledSsr[key]()
    })
  }

  console.log('Copying images...')
  for (let page in foundImages) {
    foundImages[page].forEach(image => copyFile({
      from: path.join(pagesRootDir, page, image),
      to: path.join(buildFolder, page, image)
    }))
  }

  const ms = process.hrtime(start)[0] * 1000 + process.hrtime(start)[1] / 1e6
  console.log(`The build process took ${Math.ceil(ms)}ms`)
}
