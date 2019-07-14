module.exports = (pageComponent) => `import React from 'react'
import { hydrate } from 'react-dom'
import Component from '${pageComponent}'
const data = JSON.parse(document.querySelector('#data').text)
hydrate(<Component data={data} />, document.querySelector('#root'))
`
