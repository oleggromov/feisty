module.exports = (pageComponent) => `import React from 'react'
import { hydrate } from 'react-dom'
import Component from '${pageComponent}'
const { meta, data, common } = JSON.parse(document.querySelector('#data').text)
hydrate(<Component meta={meta} data={data} common={common} />, document.querySelector('#root'))`
