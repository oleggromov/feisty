const Bundler = require('parcel-bundler')
const path = require('path');
const fs = require('fs')

const bundleServer = async function ({ source, outDir }) {
  const outFile = 'ssr.js'
  const bundler = new Bundler(source, {
    outDir,
    outFile,
    target: 'node',
    sourceMaps: false,
    logLevel: 1,
    publicUrl: '../assets/'
  })

  const bundle = await bundler.bundle()
  const builtPath = path.join(outDir, outFile)

  delete require.cache[require.resolve(builtPath)]
  return require(builtPath)
}

const bundleClient = async function ({ sources, outDir }) {
  const bundler = new Bundler(sources, {
    outDir,
    target: 'browser',
    sourceMaps: false,
    logLevel: 1,
    minify: false,
    hmr: false,
    publicUrl: '../assets/'
  })

  const result = await bundler.bundle()
  const bundleMap = {}

  result.childBundles.forEach(bundle => {
    const children = []
    children.push(path.parse(bundle.name).base)
    bundle.childBundles.forEach(bundle => {
      children.push(path.parse(bundle.name).base)
    })
    bundleMap[path.parse(bundle.entryAsset.basename).name] = children
  })

  return bundleMap
}

module.exports = {
  bundleServer,
  bundleClient
}
