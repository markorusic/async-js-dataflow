const path = require('path')
const open = require('open')
const Bundler = require('parcel-bundler')

const PORT = 1234
const entryFiles = path.join(__dirname, '../public/index.html')

const bundler = new Bundler(entryFiles)
bundler.serve(PORT).then(() => open('http://localhost:' + PORT))
