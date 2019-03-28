const path = require('path')
const fs = require('fs')
const postcss = require('postcss')
const genericNames = require('generic-names')
const ExtractImports = require('postcss-modules-extract-imports')
const LocalByDefault = require('postcss-modules-local-by-default')
const Scope = require('postcss-modules-scope')
const Values = require('postcss-modules-values')

generateScopedName = genericNames('[name]__[local]___[hash:base64:5]', {
  context: '/tmp'
})

const plugins = [
  Values,
  LocalByDefault,
  ExtractImports,
  new Scope({ generateScopedName }),
]

module.exports = ({ rootDir, list }) => {
  // TODO fix relative paths
  list.forEach(css => {
    const fullPath = path.resolve(rootDir, css)
    const content = fs.readFileSync(fullPath, { encoding: 'utf8' })

    postcss(plugins)
      .process(content, { from: fullPath, to: 'dummy.css' })
      .then(result => {
        // console.log(fullPath)
        console.log(result.css)
      })
  })
}
