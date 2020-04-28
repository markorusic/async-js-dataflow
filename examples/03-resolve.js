const colors = require('colors/safe')

const post = {
  id: 2,
  title: 'qui est esse',
  body: 'body'
}

Promise.resolve(post).then(post =>
  console.log(colors.white('Post title is'), colors.green(post.title))
)
