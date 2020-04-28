const axios = require('axios')
const colors = require('colors/safe')

const fetchUser = id =>
  axios
    .get('https://jsonplaceholder.typicode.com/users/' + id)
    .then(response => response.data)

const fetchUserData = (user, resource) =>
  axios
    .get(`https://jsonplaceholder.typicode.com/users/${user.id}/${resource}`)
    .then(response => response.data)

const run = async () => {
  try {
    const user = await fetchUser(1)
    const [todos, albums, comments] = await Promise.all([
      fetchUserData(user, 'todos'),
      fetchUserData(user, 'albums'),
      fetchUserData(user, 'comments')
    ])
    console.log(colors.green('todos count'), todos.length)
    console.log(colors.green('albums count'), albums.length)
    console.log(colors.green('comments count'), comments.length)
  } catch (err) {
    console.log(colors.red('Error occured:'), err.message)
  } finally {
    console.log(colors.cyan('Promise fulfilled'))
  }
}

run()
