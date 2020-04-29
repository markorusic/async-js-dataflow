const axios = require('axios')
const colors = require('colors/safe')

axios
  .get('http://localhost:3000/posts/2')
  .then(response => response.data)
  .then(post => post.title)
  .then(title => console.log('Post title is', colors.green(title)))
  .catch(err => console.log(colors.red('Error occured:'), err.message))
  .finally(() => console.log(colors.cyan('Promise fulfilled')))
