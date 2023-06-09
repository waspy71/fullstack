import Togglable from './Togglable'
import NewForm from './NewForm'
import Blog from './Blog'
import blogService from '../services/blogs'

import { useNotificationDispatch, userValue } from '../reducers/DataContext'

import { useMutation, useQueryClient } from 'react-query'

const MainMenu = ({ blogs }) => {
  const queryClient = useQueryClient()

  const notify = useNotificationDispatch()
  const user = userValue()

  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      newBlog.user = { name: user.user.name, username: user.user.username }
      queryClient.setQueriesData('blogs', blogs.concat(newBlog))
      queryClient.invalidateQueries('users')
      notify(`A new blog ${newBlog.title} by ${newBlog.author} added`)
    },
    onError: (error) => {
      notify(error.response.data.error, 'error')
    },
  })

  const likeBlogMutation = useMutation(blogService.updateLikes, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const handleLikes = async (blog) => {
    likeBlogMutation.mutate(blog)
  }

  const deleteBlogMutation = useMutation(blogService.deleteBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
      queryClient.invalidateQueries('users')
      notify('Blog has been removed')
    },
    onError: (error) => {
      notify(`error: ${error.response.data}`, 'error')
    },
  })

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog.id)
    }
  }

  if (blogs.isLoading) {
    return <div>loading data...</div>
  }

  if (blogs.isError) {
    return <div>blog service not available due to problems in server</div>
  }

  return (
    <>
      <Togglable buttonLabel='new blog'>
        <NewForm createBlog={newBlogMutation.mutate} />
      </Togglable>
      <br></br>
      <br />
      {blogs.data
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            removeBlog={removeBlog}
            username={user.user.username}
            handleLikes={handleLikes}
          />
        ))}
    </>
  )
}

export default MainMenu
