const path = require('path')
const fs = require('fs')
const del = require('del')

const cleanDir = ({ cwd, folder }) =>
  del.sync(path.join(cwd, folder, '*'))

const writePage = ({ cwd, buildFolder }, page) => {
  const filename = path.join(cwd, buildFolder, page.htmlPath)
  const dir = path.parse(filename).dir
  if (dir) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(filename, page.html)
}

module.exports = {
  cleanDir,
  writePage
}
