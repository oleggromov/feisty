const argv = require('yargs').argv
const Feisty = require('./index')
const feisty = new Feisty()

const commands = {
  build: feisty.build
}

const unknownCommand = `Feisty can't recognize the command.
Please use the following:
  feisty build
`

module.exports = function () {
  const command = argv._[0]

  if (command in commands) {
    commands[command](argv._.slice(1))
  } else {
    console.error(unknownCommand)
    process.exit(1)
  }
}
