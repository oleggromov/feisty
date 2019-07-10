const path = require('path')
const fs = require('fs')
const del = require('del')

const cleanDir = folder => del.sync(path.join(folder, '*'))

const writeFile = ({ filename, content }) => {
  const dir = path.parse(filename).dir

  if (dir) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(filename, content)
}

module.exports = {
  cleanDir,
  writeFile
}
