const path = require('path')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const babel = require('@babel/core')
const { requireFromString } = require('require-from-memory')

const renderComponent = ({ componentDir }, page) => {
  const componentFile = path.resolve(componentDir, `${page.component}.js`)
  const { code } = babel.transformFileSync(componentFile, {
    presets: ['@babel/env', '@babel/preset-react']
  })

  const Component = requireFromString(code, componentFile)
  const rendered = React.createElement(Component.default, page)
  return ReactDOMServer.renderToString(rendered)
}

module.exports = renderComponent
