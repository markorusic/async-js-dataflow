const colors = require('colors/safe')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

delay(1000)
  .then(() => console.log(colors.green('after 1s')))
  .then(() => delay(1000))
  .then(() => console.log(colors.green('after 2s')))
  .then(() => delay(1000))
  .then(() => console.log(colors.green('after 3s')))
  .finally(() => console.log(colors.cyan('Promise fulfilled')))
