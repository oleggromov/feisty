const fs = require('fs')
const yaml = require('js-yaml')
const marked = require('marked')
const resolveUrl = require('./resolve-url')

const readFile = file => fs.readFileSync(file, { encoding: 'utf8' })
const readYaml = file => yaml.safeLoad(readFile(file))

const readMarkdown = (file, { foundImages = [], baseImageUrl = '' }) => {
  const Renderer = new marked.Renderer()

  Renderer.image = (href, title, text) => {
    foundImages.push(href)

    return [
      `<img src="${resolveUrl(href, baseImageUrl)}"`,
      text ? ` alt="${text}"` : '',
      title ? ` title="${title}"` : '',
      ' />'
    ].join('')
  }

  return marked(readFile(file), { renderer: Renderer })
}

module.exports = {
  readYaml,
  readMarkdown
}
