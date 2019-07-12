const path = require('path')
const fs = require('fs')
const del = require('del')

const cleanDir = folder => del.sync(path.join(folder, '*'))

const createDir = filename => {
  const dir = path.parse(filename).dir
  if (dir) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const writeFile = ({ filename, content }) => {
  createDir(filename)
  fs.writeFileSync(filename, content)
}

const copyFile = ({ from, to }) => {
  createDir(to)
  fs.copyFileSync(from, to)
}

module.exports = {
  cleanDir,
  writeFile,
  copyFile
}
