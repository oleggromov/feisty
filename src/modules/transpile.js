const fs = require('fs')
const os = require('os')
const path = require('path')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

const createTemp = () => fs.mkdtempSync(`${os.tmpdir()}${path.sep}`)
const getDepsDir = () => {
  const root = path.resolve(path.parse(require.main.filename).dir, '..')
  return path.join(root, 'node_modules')
}

module.exports = async ({ cwd, componentDir }) => {
  const tmpDir = createTemp()
  const babelCmd = `$(yarn bin)/babel ${componentDir} --out-dir ${tmpDir}\
    --presets=@babel/preset-env,@babel/preset-react`

  await exec(`ln -s ${getDepsDir()} ${tmpDir}`)
  const { stdout, stderr } = await exec(babelCmd, { cwd: __dirname })

  if (stderr) {
    throw new Error(stderr)
  }

  return tmpDir
}
