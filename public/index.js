import React from 'react'
import ReactDOM from 'react-dom'

const App = () => <div>Hello world</div>

const mountNode = document.getElementById('app')
ReactDOM.render(<App />, mountNode)
