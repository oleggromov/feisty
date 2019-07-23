const fs = require('fs')
const yaml = require('js-yaml')
const marked = require('marked')

const getCustomRenderer = require('./markdown-renderer')

const readFile = file => fs.readFileSync(file, { encoding: 'utf8' })
const readYaml = file => yaml.safeLoad(readFile(file))

const readMarkdown = (file, { foundImages = [], baseImageUrl = '' }) => {
  const CustomRenderer = getCustomRenderer({
    image: { foundImages, baseImageUrl }
  })

  return marked(readFile(file), { renderer: CustomRenderer })
}

module.exports = {
  readYaml,
  readMarkdown
}
