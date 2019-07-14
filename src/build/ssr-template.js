const splitBundles = bundles => {
  const result = { css: [], js: [] }

  if (!Array.isArray(bundles) || bundles.length === 0) {
    return result
  }

  return bundles.reduce((acc, bundle) => {
    if (bundle.match(/\.css$/)) {
      acc.css.push(bundle)
    }

    if (bundle.match(/\.js$/)) {
      acc.js.push(bundle)
    }

    return acc
  }, result)
}

const renderCssBundles = bundles =>
  bundles.map(bundle => `<link rel="stylesheet" type="text/css" href="${bundle}" />`)

const renderJsBundles = bundles =>
  bundles.map(bundle => `<script src="${bundle}"></script>`)

const wrapComponent = ({ bundles, stringifiedData }) => {
  const { css, js } = splitBundles(bundles)
  return `<!doctype html>
<html>
<head>
  ${renderCssBundles(css)}
  {{ PAGE_HEAD }}
</head>
<body>
  <div id="root">{{ COMPONENT_HTML }}</div>
  <script id="data" type="application/json">{{ COMPONENT_DATA }}</script>
  ${renderJsBundles(js)}
</body>
</html>`
}

const renderPageFunction = (page, pageBundles, pageComponents) => {
  const pageName = page.data.page
  const stringifiedData = JSON.stringify(page)
  const template = wrapComponent({
    bundles: pageBundles[pageName],
    stringifiedData
  })

  return `
    "${page.meta.writePath}": function () {
      const Component = require('${pageComponents[pageName]}').default
      const componentHtml = ReactDOMServer.renderToString(<Component data={${stringifiedData}} />)
      const headContents = [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString()
      ].join('')

      return (\`${template}\`)
        .replace('{{ COMPONENT_HTML }}', componentHtml)
        .replace('{{ COMPONENT_DATA }}', JSON.stringify(${stringifiedData}))
        .replace('{{ PAGE_HEAD }}', headContents)
    }`
}

module.exports = (pages, pageComponents, pageBundles) => [
    `import React from 'react'
    import ReactDOMServer from 'react-dom/server'
    import { Helmet } from 'react-helmet'
    export default {`,
      pages.map(page => renderPageFunction(page, pageBundles, pageComponents)),
    '}'
  ].join('\n')
