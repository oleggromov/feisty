const imports = `import React from 'react'
  import ReactDOM from 'react-dom'`

module.exports = (pageComponent) => `${imports}
  import Component from '${pageComponent}'
  // const props = JSON.parse(initialProps.text)
  const props = {}
  ReactDOM.hydrate(<Component {...props} />, document.querySelector('html'))
  // initialProps.parentNode.removeChild(initialProps)
  `
