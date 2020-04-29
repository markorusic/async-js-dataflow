const axios = require('axios')
const colors = require('colors/safe')

const fetchUserData = resource =>
  axios
    .get('http://localhost:3000/users/1/' + resource)
    .then(response => response.data)

Promise.all([
  fetchUserData('todos'),
  fetchUserData('albums'),
  fetchUserData('comments')
])
  .then(([todos, albums, comments]) => {
    console.log(colors.green('todos count'), todos.length)
    console.log(colors.green('albums count'), albums.length)
    console.log(colors.green('comments count'), comments.length)
  })
  .catch(err => console.log(colors.red('Error occured:'), err.message))
  .finally(() => console.log(colors.cyan('Promise fulfilled')))
