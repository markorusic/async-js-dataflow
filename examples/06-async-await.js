const axios = require('axios')
const colors = require('colors/safe')

const fetchUser = id =>
  axios.get('http://localhost:3000/users/' + id).then(response => response.data)

const fetchUserResource = (user, resource) =>
  axios
    .get(`http://localhost:3000/users/${user.id}/${resource}`)
    .then(response => response.data)

const run = async () => {
  try {
    const [userId] = process.argv.slice(2)
    if (!userId) {
      throw new Error('You have to pass user id as arugment')
    }
    const user = await fetchUser(userId)
    console.log(`User with id ${userId} is ${colors.green(user.name)}`)
    const [todos, albums, comments] = await Promise.all([
      fetchUserResource(user, 'todos'),
      fetchUserResource(user, 'albums'),
      fetchUserResource(user, 'comments')
    ])
    console.log(`${colors.green(user.name)}'s details:`)
    console.log('todos count:', colors.green(todos.length))
    console.log('albums count:', colors.green(albums.length))
    console.log('comments count:', colors.green(comments.length))
  } catch (err) {
    console.log(colors.red('Error occured:'), err.message)
  } finally {
    console.log(colors.cyan('Promise fulfilled'))
  }
}

run()
