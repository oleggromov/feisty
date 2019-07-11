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

const wrapComponent = ({ title, bundles, stringifiedData }) => {
  const { css, js } = splitBundles(bundles)
  return `<!doctype html>
<html>
<head>
  <title>${title}</title>
  ${renderCssBundles(css)}
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=PT+Serif:400,700&display=swap&subset=cyrillic" rel="stylesheet">
  <link href="/favicon.png" rel="icon" />
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
    title: page.data.meta.title,
    bundles: pageBundles[pageName],
    stringifiedData
  })

  return `
    "${page.meta.writePath}": function () {
      const Component = require('${pageComponents[pageName]}').default
      const componentHtml = ReactDOMServer.renderToString(<Component data={${stringifiedData}} />)
      return (\`${template}\`)
        .replace('{{ COMPONENT_HTML }}', componentHtml)
        .replace('{{ COMPONENT_DATA }}', JSON.stringify(${stringifiedData}))
    }`
}

module.exports = (pages, pageComponents, pageBundles) => [
    `import React from 'react'
    import ReactDOMServer from 'react-dom/server'
    module.exports = {`,
      pages.map(page => renderPageFunction(page, pageBundles, pageComponents)),
    '}'
  ].join('\n')
