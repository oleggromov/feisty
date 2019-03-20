const argv = require('yargs').argv
const feisty = require('./index')

const unknownCommand = `Feisty can't recognize the command.
Please use the following:
  feisty build
`

module.exports = function () {
  const command = argv._[0]

  if (command in feisty) {
    try {
      feisty[command]({ cwd: process.cwd() })
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  } else {
    console.error(unknownCommand)
    process.exit(1)
  }
}
