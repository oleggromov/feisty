const fs = require('fs')
const yaml = require('js-yaml')
const marked = require('marked')

const readFile = file => fs.readFileSync(file, { encoding: 'utf8' })
const readYaml = file => yaml.safeLoad(readFile(file))
// TODO: add custom img/link component renderers?
const readMarkdown = file => marked(readFile(file))

module.exports = {
  readYaml,
  readMarkdown
}
