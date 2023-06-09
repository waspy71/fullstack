import { useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import NewForm from './components/NewForm'
import Togglable from './components/Togglable'


import { handleNotification } from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { getBlogs, blogCreate, blogDelete, blogLike } from './reducers/blogsReducer'
import { setUsername, setPassword, setUser, userLogin, loggedUserToken } from './reducers/signedinReducer'


const App = () => {
  const blogs = useSelector(state => {
    return [...state.blogs]
  })

  const user = useSelector(state => state.signedIn.user)
  const username = useSelector(state => state.signedIn.username)
  const password = useSelector(state => state.signedIn.password)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(loggedUserToken(user))
    }
  }, [])

  const loginForm =  () => {
    return (
      <form onSubmit={handleLogin}>
        <h2> Log in to application </h2>
        <Notification />
        <div>
        username
          <input
            id='username'
            type='text'
            value={username}
            name='username'
            onChange={({ target }) => dispatch(setUsername(target.value))}
          />
        </div>
        <div>
        password
          <input
            id='password'
            type='text'
            value={password}
            name='password'
            onChange={({ target }) => dispatch(setPassword(target.value))}
          />
        </div>
        <button id='login-button' type='submit'>login</button>
      </form>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(userLogin({ username, password }))
  }

  const handleCreate = async (blogObject) => {
    try {
      dispatch(blogCreate(blogObject, user))


      dispatch(handleNotification(
        `A new blog ${blogObject.title} by ${blogObject.author} added`
      ))
    } catch (exception){
      console.log(exception)
    }
  }

  const logOut = () => {
    window.localStorage.clear()
    dispatch(setUser(null))
  }

  const removeBlog = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)){
        dispatch(blogDelete(blog.id))
        dispatch(handleNotification('Blog has been removed'))
      }
    } catch (exception) {
      dispatch(handleNotification(`error: ${exception.response.data}`, 'error'))
    }
  }

  const handleLikes = (blog) => {
    dispatch(blogLike(blog))
  }

  return (
    <div id='app'>
      { !user && loginForm() }
      { user && <div>
        <h2>blogs</h2>
        <Notification />
        <p>{user.name} is logged in</p>
        <button type='submit' onClick={logOut}>log out</button>
        <br></br><br/>
        <Togglable buttonLabel='new blog'>
          <NewForm
            createBlog={handleCreate}
          />
        </Togglable>
        <br></br><br/>
        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} removeBlog={removeBlog} username={user.username} handleLikes={handleLikes}/>
        )}
      </div>
      }
    </div>
  )
}


export default App