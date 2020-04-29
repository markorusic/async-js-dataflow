import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useAsync } from 'react-use'
import axios from 'axios'

const fetchUsers = () =>
  axios.get('http://localhost:3000/users').then(response => response.data)

const fetchUserResource = (user, resource) =>
  axios
    .get(`http://localhost:3000/users/${user.id}/${resource}`)
    .then(response => response.data)

const fetchUserDetails = async user => {
  if (!user) {
    return null
  }
  const [todos, albums, comments] = await Promise.all([
    fetchUserResource(user, 'todos'),
    fetchUserResource(user, 'albums'),
    fetchUserResource(user, 'comments')
  ])
  return {
    todos,
    albums,
    comments
  }
}

const App = () => {
  const [activeUser, setActiveUser] = useState(null)
  const users = useAsync(fetchUsers)
  const userDetails = useAsync(() => fetchUserDetails(activeUser), [activeUser])

  return (
    <div className="p-20 grid grid-cols-12 gap-5">
      <div className="col-span-4">
        <DataContainer data={users}>
          <UsersList users={users.value} onUserClick={setActiveUser} />
        </DataContainer>
      </div>
      <div className="col-span-8">
        {activeUser && (
          <DataContainer data={userDetails}>
            <UserDetails user={activeUser} details={userDetails.value} />
          </DataContainer>
        )}
      </div>
    </div>
  )
}

const Loader = () => (
  <div className="flex justify-center">
    <h4>Loading...</h4>
  </div>
)

const ErrorAlert = ({ message }) => (
  <div
    class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    role="alert"
  >
    <span class="block sm:inline">{message}</span>
    <span class="absolute top-0 bottom-0 right-0 px-4 py-3"></span>
  </div>
)

const DataContainer = ({ children, data }) => (
  <>
    {data.loading && <Loader />}
    {data.error && <ErrorAlert message={data.error.message} />}
    {data.value && children}
  </>
)

const UsersList = ({ users = [], onUserClick, ...props }) => {
  const [username, serUsername] = useState('')
  return (
    <div {...props}>
      <input
        type="text"
        className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Search for user"
        onChange={event => serUsername(event.target.value)}
      />
      <ul>
        {users
          .filter(user =>
            user.name.toLowerCase().includes(username.toLowerCase())
          )
          .map(user => (
            <li
              className="p-5 rounded cursor-pointer bg-blue-300 text-white mb-1 transition duration-300 hover:bg-blue-500 "
              key={user.id}
              onClick={() => onUserClick(user)}
            >
              {user.name}
            </li>
          ))}
      </ul>
    </div>
  )
}

const UserDetails = ({ user, details, ...props }) => (
  <div className="col-span-8 border-solid border-1 border-gray-600" {...props}>
    <h1 className="text-4xl text-blue-500">{user.name}'s details</h1>
    <ul>
      <li className="text-xl">Todos count: {details.todos.length}</li>
      <li className="text-xl">Albums count: {details.albums.length}</li>
      <li className="text-xl">Comments count: {details.comments.length}</li>
    </ul>
  </div>
)

const mountNode = document.getElementById('app')
ReactDOM.render(<App />, mountNode)
