const open = require('open')
const Path = require('path')
const Bundler = require('parcel-bundler')

const entryFiles = Path.join(__dirname, '../public/index.html')
const port = 1234

const bundler = new Bundler(entryFiles)
bundler.serve(port).then(() => open('http://localhost:' + port))
