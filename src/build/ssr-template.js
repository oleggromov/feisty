module.exports = (pages, pageComponentMap) =>
  [
    `
    import React from 'react'
    import ReactDOMServer from 'react-dom/server'
    module.exports = {`,
    pages.map(page => `
      "${page.meta.writePath}": function () {
        const Component = require('${pageComponentMap[page.data.page]}').default
        return ReactDOMServer.renderToString(<Component data={${JSON.stringify(page)}} />)
      }`),
    '}'
  ].join('\n')
