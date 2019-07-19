const { cleanDir, writeFile, copyFile } = require('../modules/fs-utils')
const getPages = require('./get-pages')
const { bundlePrerender, bundleClient } = require('./bundle')
const ssrTemplate = require('./ssr-template')
const bundleTemplate = require('./bundle-template')
const { readYaml } = require('../modules/read')
const objectDeepMap = require('../modules/object-deep-map')
const glob = require('glob')
const path = require('path')

module.exports = async ({ cwd }) => {
  const start = process.hrtime()

  const pagesRootDir = path.join(cwd, 'content/pages')
  const buildFolder = path.join(cwd, 'build')
  const tmpFolder = path.join(cwd, '.feisty')
  cleanDir(buildFolder)
  cleanDir(tmpFolder)

  const foundImages = {}
  const pages = getPages({
    sources: glob.sync(`${pagesRootDir}/**/index.yml`),
    rootDir: pagesRootDir,
    foundImages
  })

  const urlPageMap = pages.reduce((acc, page) => {
    const url = page.meta.url
    if (acc[url]) {
      throw new Error(`Duplicate URL ${url}`)
    }

    acc[url] = page
    return acc
  }, {})

  pages.forEach(page => {
    const urlFilter = page.data.pages
    if (urlFilter) {
      const filter = new RegExp(urlFilter)
      const matchingPages = []
      for (let url in urlPageMap) {
        if (url.match(filter)) {
          matchingPages.push(urlPageMap[url])
        }
      }
      page.data.pages = matchingPages
    }
  })

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

  const jsSource = ssrTemplate(pages, pageComponents, bundles)
  const ssrPath = path.join(tmpFolder, 'ssr/ssr.js')
  console.log(`SSR template ${ssrPath}...`)
  writeFile({
    filename: ssrPath,
    content: jsSource
  })

  console.log('Processing server bundle...')
  const bundledSsr = await bundlePrerender({
    source: path.join(tmpFolder, 'ssr/ssr.js'),
    outDir: path.join(tmpFolder, 'ssr')
  })

  for (let key in bundledSsr) {
    const pagePath = key.replace(/\.json$/, '.html')
    console.log(`Writing ${pagePath}...`)
    writeFile({
      filename: path.join(buildFolder, pagePath),
      content: bundledSsr[key]()
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
