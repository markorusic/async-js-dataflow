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
  const [username, setUsername] = useState(null)
  const [activeUser, setActiveUser] = useState(null)
  const users = useAsync(() => fetchUsers(username), [username])
  const userDetails = useAsync(() => fetchUserDetails(activeUser), [activeUser])

  return (
    <div className="p-10">
      <h1 className="text-4xl mb-10 text-gray-800">
        Async Dataflow - React example
      </h1>
      <div className="grid grid-cols-12">
        <div className="col-span-4">
          <SearchInput
            autoFocus
            placeholder="Search for user"
            onChange={setUsername}
          />
          <UsersList users={users} onUserClick={setActiveUser} />
        </div>
        <div className="col-span-8 ml-10">
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
              className="p-5 rounded cursor-pointer bg-blue-300 text-white mb-1 transition duration-300 hover:bg-blue-500 "
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
  <div className="col-span-8 border-solid border-1 border-gray-600" {...props}>
    <h2 className="text-3xl text-blue-500">{user.username}'s details</h2>
    <AsyncContainer {...details}>
      {details.value && (
        <ul>
          <li className="text-xl">Todos count: {details.value.todos.length}</li>
          <li className="text-xl">
            Albums count: {details.value.albums.length}
          </li>
          <li className="text-xl">
            Comments count: {details.value.comments.length}
          </li>
        </ul>
      )}
    </AsyncContainer>
  </div>
)

const AsyncContainer = ({ children, loading, error, value }) => (
  <>
    {loading && <span className="text-3xl text-blue-700">Loading...</span>}
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
