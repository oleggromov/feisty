module.exports = (pageComponent) => `
import React from 'react'
import ReactDOM from 'react-dom'
import Component from '${pageComponent}'
const data = JSON.parse(document.querySelector('#data').text)
ReactDOM.hydrate(<Component data={data} />, document.querySelector('#root'))
`
