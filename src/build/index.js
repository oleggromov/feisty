const { cleanDir, writeFile, copyFile } = require('../modules/fs-utils')
const watermarkImages = require('../modules/watermark-images')
const getPages = require('./get-pages')
const { bundlePrerender, bundleClient } = require('./bundle')
const ssrTemplate = require('./ssr-template')
const bundleTemplate = require('./bundle-template')
const { readYaml } = require('../modules/read')
const objectDeepMap = require('../modules/object-deep-map')
const glob = require('glob')
const path = require('path')
const clone = require('../modules/clone')
require('dotenv').config()

const createUrlPageMap = pages => pages.reduce((acc, page) => {
  const url = page.meta.url
  if (acc[url]) {
    throw new Error(`Duplicate URL ${url}`)
  }

  if (!page.data.draft) {
    acc[url] = page
  } else {
    console.log(`Excluding ${url}, as a draft, from the page list...`)
  }

  return acc
}, {})

const filterToPages = ({ urlFilter, urlPageMap }) => {
  const filter = new RegExp(urlFilter)
  const matchingPages = []
  for (let url in urlPageMap) {
    if (url.match(filter)) {
      matchingPages.push(urlPageMap[url])
    }
  }
  return clone(matchingPages.sort(byPublished))
    .map(page => {
      delete page.common
      delete page.data.content
      return page
    })
}

const byPublished = (a, b) => {
  return new Date(b.data.published) - new Date(a.data.published)
}

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

  const urlPageMap = createUrlPageMap(pages)

  pages.forEach(page => {
    // ToDo: deal with hardcoded keys
    if (page.data.pages) {
      page.data.pages = filterToPages({
        urlFilter: page.data.pages,
        urlPageMap
      })
    }

    if (page.common.pages) {
      page.common.pages = filterToPages({
        urlFilter: page.common.pages,
        urlPageMap
      })
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

  console.log('Adding watermarks and copying images...')
  const images = []
  for (let page in foundImages) {
    for (let i = 0; i < foundImages[page].length; i++) {
      const image = foundImages[page][i]
      images.push({
        from: path.join(pagesRootDir, page, image),
        to: path.join(buildFolder, page, image)
      })
    }
  }
  await watermarkImages({ images, text: '© oleggromov.com' })

  const ms = process.hrtime(start)[0] * 1000 + process.hrtime(start)[1] / 1e6
  console.log(`The build process took ${Math.ceil(ms)}ms`)
}
