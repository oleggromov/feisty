const path = require('path')
const getPages = require('./modules/getPages')
const renderComponent = require('./modules/renderComponent')
const { cleanDir, writePage } = require('./modules/fsUtils')

const FileReader = require('./modules/FileReader')
const FileWriter = require('./modules/FileWriter')

module.exports = async ({ cwd }) => {
  const start = process.hrtime()

  const reader = new FileReader({ baseDir: cwd })
  const writer = new FileWriter({ baseDir: cwd })

  reader.on('*.yml', (...args) => {
    console.log('YAML', args[0].file)
  })

  reader.read('content/**/index.yml')
//
//   // const pages = getPages({ cwd, pattern: 'content/**/index.yml' })
//   //
//   // cleanDir({ cwd, folder: 'build' })
//   // const componentSourceDir = path.resolve(cwd, 'components')
//   // const componentDir = await transpile({ componentDir: componentSourceDir })
//   // console.log(`Transpiled components put into: ${componentDir}`)
//   //
//   // const usedComponents = []
//   //
//   // for (pagePath in pages) {
//   //   let current = pages[pagePath]
//   //   usedComponents.push(current.component)
//   //   current.htmlPath = pagePath.replace('.yml', '.html')
//   //   current.html = renderComponent({ componentDir }, current)
//   //   writePage({ cwd, buildFolder: 'build' }, current)
//   //   break
//   // }
//   //
//   // console.log(usedComponents)
//   //
//   // const cssImports = await getCssDependencies({
//   //   entries: usedComponents.map(component =>
//   //     path.join(componentSourceDir, component + '.js')),
//   //   baseDir: componentSourceDir
//   // })
//   //
//   // console.log(cssImports)
//   //
//   // getTranspiledCss({ rootDir: componentSourceDir, list: cssImports })
//   //
//   // // console.log(pages)
//   // // console.log(JSON.stringify(pages['notes/index.yml'].notes, null, 2))
//
//   const ms = Math.ceil(process.hrtime(start)[1] / 1e6)
//   console.log(`The build process took ${ms}ms`)
}
