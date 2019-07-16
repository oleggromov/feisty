const handler = require('serve-handler')
const http = require('http')
const path = require('path')
const fs = require('fs')
const build = require('../build/')

module.exports = async ({ cwd }) => {
  const onChange = (baseName) => async (eventType, file) => {
    const filename = path.join(baseName, file)
    if (eventType === 'change' || eventType === 'rename') {
      console.log(`Changed ${filename}...`)
      await build({ cwd })
    } else {
      console.error(eventType, filename)
      throw new Error('Watching failed')
    }
  }

  const options = {
    cleanUrls: true,
    public: path.join(cwd, 'build')
  }

  const server = http.createServer((request, response) => handler(request, response, options))

  await build({ cwd })

  server.listen(8080, () => {
    console.log('Running at http://localhost:8080');
  })

  const paths = ['content', 'components']
  paths.map(folder => path.join(cwd, folder))
    .forEach(watchFolder => {
      console.log(`Watching ${watchFolder}...`)
      fs.watch(watchFolder, { recursive: true }, onChange('content'))
    })
}
