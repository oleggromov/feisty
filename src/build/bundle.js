const path = require('path')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const bundleServer = async ({ source, outDir }) => {
  console.log('server', source, outDir)

  const bundle = await rollup.rollup({
    input: source,
    plugins: [
      babel({
        babelrc: false,
        presets: [
          ['@babel/preset-env', { modules: false }],
          '@babel/preset-react'
        ]
      }),
      resolve(),
      commonjs()
    ]
  })

  console.log(bundle)

  const outputOptions = {
    dir: outDir,
    format: 'cjs'
  }

  const { output } = await bundle.generate(outputOptions)

  // console.log(output)

  await bundle.write(outputOptions);

  const builtPath = path.join(outDir, 'ssr.js')

  delete require.cache[require.resolve(builtPath)]
  return require(builtPath)
}

const bundleClient = async ({ sources, outDir}) => {
  // console.log('client')
  // console.log(sources, outDir)
}

module.exports = {
  bundleServer,
  bundleClient
}
