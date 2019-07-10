const imports = `import React from 'react'
  import ReactDOMServer from 'react-dom/server'`
const doctype = '<!doctype html>'

module.exports = (pages, pageComponents, pageBundles) => [
    `${imports}
    module.exports = {`,
    pages.map(page => {
      const pageName = page.data.page
      return `
        "${page.meta.writePath}": function () {
          const Component = require('${pageComponents[pageName]}').default
          return '${doctype}' + ReactDOMServer.renderToString(<Component data={${JSON.stringify(page)}} bundles={${JSON.stringify(pageBundles[pageName])}} />)
        }`
    }),
    '}'
  ].join('\n')
