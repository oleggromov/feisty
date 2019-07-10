const Bundler = require('parcel-bundler')
const path = require('path');
const fs = require('fs')

module.exports = async function ({ source, outDir }) {
  const outFile = 'ssr.js'
  const bundler = new Bundler(source, {
    outDir,
    outFile,
    cache: false,
    target: 'node',
    sourceMaps: false,
    logLevel: 1
  })

  const bundle = await bundler.bundle()
  const builtPath = path.join(outDir, outFile)

  delete require.cache[require.resolve(builtPath)]
  return require(builtPath)
}
