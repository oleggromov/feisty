const argv = require('yargs').argv
const feisty = require('./index')

const unknownCommand = `Feisty can't recognize the command.
Please use the following:
  feisty build
`

module.exports = async function () {
  const command = argv._[0]

  if (command in feisty) {
    await feisty[command]({ cwd: process.cwd() })

    if (command !== 'dev') {
      process.exit(0)
    }
  } else {
    console.error(unknownCommand)
    process.exit(1)
  }
}
