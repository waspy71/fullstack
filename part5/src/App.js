import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import NewForm from './components/NewForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [info, setInfo] = useState({ message: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm =  () => (
    <form onSubmit={handleLogin}>
      <h2> Log in to application </h2>
      <Notification info={info} />
      <div>
        username
        <input
          id='username'
          type='text'
          value={username}
          name='username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type='text'
          value={password}
          name='password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login-button' type='submit'>login</button>
    </form>
  )

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notificationHandler(exception.response.data.error, 'error')
      console.log(exception.response.data.error)
    }
  }

  const handleCreate = async (blogObject) => {
    try {
      const formBlog = await blogService.create(blogObject)
      formBlog.user = { name: user.name, username: user.username }
      setBlogs(blogs.concat(formBlog))


      notificationHandler(
        `A new blog ${formBlog.title} by ${formBlog.author} added`
      )
    } catch (exception){
      console.log(exception)
    }
  }

  const logOut = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const notificationHandler = (message, type='info') => {
    setInfo({
      message, type
    })

    setTimeout(() => {
      setInfo({ info: null })
    }, 5000)
  }

  const removeBlog = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)){
        await blogService.deleteBlog(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        notificationHandler('Blog has been removed')
      }
    } catch (exception) {
      notificationHandler(`error: ${exception.response.data}`, 'error')
    }
  }

  const handleLikes = async (blog) => {
    await blogService.updateLikes(blog)
    const newBlogList = await blogService.getAll()
    setBlogs(newBlogList)
  }

  return (
    <div id='app'>
      { !user && loginForm() }
      { user && <div>
        <h2>blogs</h2>
        <Notification info={info} />
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