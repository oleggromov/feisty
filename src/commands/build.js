const path = require('path')
const fs = require('fs')
const glob = require('glob')
const yaml = require('js-yaml')
const objectDeepMap = require('../modules/objectDeepMap')

const contentFolder = 'content'
const indexFile = 'index.yml'

module.exports = ({ cwd }) => {
  const content = path.join(cwd, `${contentFolder}/**/${indexFile}`)
  const pages = glob.sync(content)
  const contentPath = path.join(cwd, contentFolder)

  if (!pages.length) {
    throw new Error(`Cannot find any ${indexFile} files in ${contentFolder}/`)
  }

  const parsed = pages.reduce((acc, page) => {
    const content = fs.readFileSync(page, { encoding: 'utf8' })
    const key = path.relative(contentPath, page)
    acc[key] = yaml.safeLoad(content)
    return acc
  }, {})

  const loadAllContent = (key, value) => {
    // console.log(key, value)

    if (key === 'content') {
      // 1. Parse the path, check the type
      // 2. Check key existence
      // 3. Read if needed
      // 4. Replace the value with the read file
      console.log(value)
    }

    return value
  }

  // console.log(parsed['notes/observing-style-changes/index.yml'])
  console.log(objectDeepMap(parsed['notes/observing-style-changes/index.yml'], loadAllContent))
}
