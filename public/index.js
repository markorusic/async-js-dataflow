import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useAsync } from 'react-use'
import axios from 'axios'
import debounce from 'lodash.debounce'

const fetchUsers = username =>
  axios
    .get('http://localhost:3000/users', { params: { username_like: username } })
    .then(response => response.data)

const fetchUserResource = (user, resource) =>
  axios
    .get(`http://localhost:3000/users/${user.id}/${resource}`)
    .then(response => response.data)

const fetchUserDetails = async user => {
  if (user) {
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
  return null
}

const App = () => {
  const [username, setUsername] = useState(null)
  const [activeUser, setActiveUser] = useState(null)
  const users = useAsync(() => fetchUsers(username), [username])
  const userDetails = useAsync(() => fetchUserDetails(activeUser), [activeUser])

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-4xl text-center mb-10 text-gray-800">
        Async Dataflow - React example
      </h1>
      <div className="grid grid-cols-6 gap-10">
        <div className="col-span-3 xl:col-span-2 xl:col-start-2">
          <SearchInput
            autoFocus
            placeholder="Search for user"
            onChange={setUsername}
          />
          <UsersList users={users} onUserClick={setActiveUser} />
        </div>
        <div className="col-span-3 xl:col-span-2">
          {activeUser && (
            <UserDetails user={activeUser} details={userDetails} />
          )}
        </div>
      </div>
    </div>
  )
}

const SearchInput = ({ onChange, ...props }) => {
  const debouncedOnChange = debounce(value => onChange(value), [300])
  return (
    <input
      type="text"
      className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      onChange={event => debouncedOnChange(event.target.value)}
      {...props}
    />
  )
}

const UsersList = ({ users, onUserClick, ...props }) => (
  <AsyncContainer {...users}>
    <div {...props}>
      <ul>
        {users.value && users.value.length > 0 ? (
          users.value.map(user => (
            <li
              className="px-5 py-2 select-none rounded cursor-pointer bg-green-300 text-gray-800 text-xl font-semibold mb-1 transition duration-200 hover:bg-green-400"
              key={user.id}
              onClick={() => onUserClick(user)}
            >
              {user.username}
            </li>
          ))
        ) : (
          <div class="bg-orange-100 border-l-4 border-orange-500 p-4">
            <span className="text-xl text-orange-700">No Data</span>
          </div>
        )}
      </ul>
    </div>
  </AsyncContainer>
)

const UserDetails = ({ user, details, ...props }) => (
  <div className="border-solid border-1 border-gray-600" {...props}>
    <h2 className="text-3xl text-gray-800">
      <span className="text-green-600">{user.username}</span>
      's details
    </h2>
    <AsyncContainer {...details}>
      {details.value && (
        <ul>
          <li className="text-xl text-gray-800">
            Todos count:{' '}
            <span className="text-green-600 text-2xl">
              {details.value.todos.length}
            </span>
          </li>
          <li className="text-xl text-gray-800">
            Albums count:{' '}
            <span className="text-green-600 text-2xl">
              {details.value.albums.length}
            </span>
          </li>
          <li className="text-xl text-gray-800">
            Comments count:{' '}
            <span className="text-green-600 text-2xl">
              {details.value.comments.length}
            </span>
          </li>
        </ul>
      )}
    </AsyncContainer>
  </div>
)

const AsyncContainer = ({ children, loading, error, value }) => (
  <>
    {loading && <span className="text-2xl text-green-600">Loading...</span>}
    {error && (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded relative">
        <span className="block sm:inline">{error.message}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3"></span>
      </div>
    )}
    {value && children}
  </>
)

const mountNode = document.getElementById('app')
ReactDOM.render(<App />, mountNode)
