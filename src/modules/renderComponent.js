const path = require('path')
const React = require('react')
const ReactDOMServer = require('react-dom/server')

const renderComponent = ({ componentDir }, page) => {
  const componentFile = path.resolve(componentDir, `${page.component}.js`)
  const Component = require(componentFile)
  const rendered = React.createElement(Component.default, page)
  return '<!doctype html>' + ReactDOMServer.renderToString(rendered)
}

module.exports = renderComponent
