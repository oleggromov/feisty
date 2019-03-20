const path = require('path')
const fs = require('fs')
const glob = require('glob')
const yaml = require('js-yaml')
const marked = require('marked')
const objectDeepMap = require('./modules/objectDeepMap')

const contentFolder = 'content'
const indexFile = 'index.yml'

const readFile = file => fs.readFileSync(file, { encoding: 'utf8' })
const readYaml = file => yaml.safeLoad(readFile(file))
// TODO: add custom img/link component renderers?
const readMarkdown = file => marked(readFile(file))

const readPages = (contentPath, pages) => pages.reduce((acc, page) => {
  const key = path.relative(contentPath, page)
  acc[key] = readYaml(page)
  return acc
}, {})

const parsePath = (rootPath, contentPath, currentFile) => {
  if (contentPath.indexOf('~/') === 0) {
    return path.join(rootPath, contentPath.slice(2))
  }
  return path.join(rootPath, path.parse(currentFile).dir, contentPath)
}

const loadContent = (contentPath, value, currentFile) => {
  const source = parsePath(contentPath, value, currentFile)

  if (source.match(/\.md$/)) {
    return readMarkdown(source).slice(0, 100) + '...'
  } else if (source.match(/\.yml$/)) {
    return readYaml(source)
  }

  console.warn(`Unknown content type: ${source}. Skipping...`)
  return value
}

const loadList = (list) => {
  console.log(glob.sync(list))
}

module.exports = ({ cwd }) => {
  const start = process.hrtime()

  const content = path.join(cwd, `${contentFolder}/**/${indexFile}`)
  const pages = glob.sync(content)
  const contentPath = path.join(cwd, contentFolder)

  if (!pages.length) {
    throw new Error(`Cannot find any ${indexFile} files in ${contentFolder}/`)
  }

  const parsed = readPages(contentPath, pages)

  for (let currentFile in parsed) {
    objectDeepMap(parsed[currentFile], (key, value) => {
      if (key === 'content') {
        return loadContent(contentPath, value, currentFile)
      } else if (key === 'list') {
        // return '>>>> A LIST WILL BE HERE <<<<'
      }
      return value
    })

    console.log(parsed[currentFile])
  }
  console.log(`The process took ${process.hrtime(start)[1] / 1e6}ms`)
}
