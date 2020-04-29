const axios = require('axios')
const colors = require('colors/safe')

const fetchUserResource = resource =>
  axios
    .get('http://localhost:3000/users/1/' + resource)
    .then(response => response.data)

Promise.all([
  fetchUserResource('todos'),
  fetchUserResource('albums'),
  fetchUserResource('posts')
])
  .then(([todos, albums, posts]) => {
    console.log(colors.green('todos count'), todos.length)
    console.log(colors.green('albums count'), albums.length)
    console.log(colors.green('posts count'), posts.length)
  })
  .catch(err => console.log(colors.red('Error occured:'), err.message))
  .finally(() => console.log(colors.cyan('Promise fulfilled')))
