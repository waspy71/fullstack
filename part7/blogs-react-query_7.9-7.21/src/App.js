import { useEffect } from 'react'
import Notification from './components/Notification'
import MainMenu from './components/MainMenuView'
import Users from './components/Users'
import UserView from './components/UserView'
import BlogView from './components/BlogView'
import MenuBar from './components/MenuBar'

import { Routes, Route, useMatch } from 'react-router-dom'

import { Form } from 'react-bootstrap'

import { useQuery } from 'react-query'
import userService from './services/users'
import blogService from './services/blogs'

import {
  userLoginDispatch,
  userValue,
  userUsernameDispatch,
  userPasswordDispatch,
  userLogoutDispatch,
  loginHandler,
  useNotificationDispatch,
} from './reducers/DataContext'

const App = () => {
  const loginUser = userLoginDispatch()
  const firstLogin = loginHandler()
  const logoutUser = userLogoutDispatch()
  const setUserUsername = userUsernameDispatch()
  const setUserPassword = userPasswordDispatch()
  const user = userValue()

  const notify = useNotificationDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      loginUser(user)
    }
  }, [])

  //testing
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <Form.Group>
        <h2> Log in to application </h2>
        <Notification />
        <div>
          <Form.Label>username</Form.Label>
          <Form.Control
            id='username'
            type='text'
            value={user.username}
            name='username'
            onChange={({ target }) => setUserUsername(target.value)}
          />
        </div>
        <div>
          <Form.Label>password</Form.Label>
          <Form.Control
            id='password'
            type='text'
            value={user.password}
            name='password'
            onChange={({ target }) => setUserPassword(target.value)}
          />
        </div>
        <button
          id='login-button'
          type='submit'
          className='btn btn-outline-primary btn-rounded m-2'
        >
          login
        </button>
      </Form.Group>
    </form>
  )

  const handleLogin = async (event) => {
    event.preventDefault()
    firstLogin(user.username, user.password)
    notify(`Welcome ${user.username}`)
  }

  const logOut = () => {
    window.localStorage.clear()
    logoutUser()
  }

  const match = useMatch('/users/:id')
  const userId = match ? match.params.id : null

  const blogMatch = useMatch('/blogs/:id')
  const blogId = blogMatch ? blogMatch.params.id : null

  const users = useQuery('users', userService.getUsers, {
    refetchOnWindowFocus: false,
  })

  const blogs = useQuery('blogs', blogService.getAll, {
    refetchOnWindowFocus: false,
  })

  return (
    <div id='app' className='container'>
      {!user.user && loginForm()}
      {user.user && (
        <div>
          <MenuBar />
          <h2>Blogs</h2>
          <Notification />
          <p>{user.user.name} is logged in</p>
          <button
            type='submit'
            onClick={logOut}
            className='btn btn-outline-primary btn-rounded m-2'
          >
            log out
          </button>
          <br></br>
          <br />
          <Routes>
            <Route path='/' element={<MainMenu blogs={blogs} />} />
            <Route path='/users' element={<Users users={users} />} />
            <Route
              path='/users/:id'
              element={<UserView userId={userId} users={users} />}
            />
            <Route
              path='/blogs/:id'
              element={<BlogView blogId={blogId} blogs={blogs} />}
            />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
