const path = require('path')
const glob = require('glob')
const fs = require('fs')
const webpack = require('webpack')
const { prerender, client } = require('./webpack-config')

const publicPath = '/assets/'

const bundlePrerender = async ({ source, outDir }) => {
  const outFile = 'ssr-built.js'
  const prerenderConfig = prerender({
    entry: source,
    outDir,
    outFile,
    publicPath
  })

  return new Promise((resolve, reject) => {
    webpack(prerenderConfig).run((err, stats) => {
      if (err || stats.hasErrors()) {
        reject(new Error(err))
        console.error(stats.compilation.errors)
        console.error(stats.compilation.warnings)
      }

      const builtPath = path.join(outDir, outFile)
      delete require.cache[require.resolve(builtPath)]
      resolve( require(builtPath))
    })
  })
}

const bundleClient = async ({ sources, outDir }) => {
  const entries = glob.sync(sources).reduce((entries, filename) => {
    entries[path.parse(filename).name] = filename
    return entries
  }, {})

  const clientConfig = client({
    entry: entries,
    outDir,
    publicPath
  })

  return new Promise((resolve, reject) => {
    webpack(clientConfig).run((err, stats) => {
      if (err || stats.hasErrors()) {
        reject(new Error(err))
        console.error(stats.compilation.errors)
        console.error(stats.compilation.warnings)
      }

      const entrypoints = stats.toJson().entrypoints
      const bundles = {}

      for (let key in entrypoints) {
        bundles[key] = entrypoints[key].assets.map(asset => path.join(publicPath, asset))
      }

      resolve(bundles)
    })
  })
}

module.exports = {
  bundlePrerender,
  bundleClient
}
