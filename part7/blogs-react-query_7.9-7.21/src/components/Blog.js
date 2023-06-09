import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Blog = ({ blog, removeBlog, username, handleLikes }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: 10,
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className='hidden'>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
        <button
          className='btn btn-outline-dark btn-rounded m-2'
          onClick={toggleVisibility}
        >
          view
        </button>
      </div>
      <div style={showWhenVisible} className='shown'>
        {blog.title} {blog.author}
        <button
          className='btn btn-rounded btn-floating btn-secondary m-2'
          onClick={toggleVisibility}
        >
          hide
        </button>
        <br></br>
        {blog.url}
        <br></br>
        likes {blog.likes}
        <button
          className='btn btn-success btn-rounded m-2'
          onClick={() => handleLikes(blog)}
        >
          like
        </button>
        <br></br>
        {blog.user.name}
        <br></br>
        {blog.user.username === username && (
          <button
            className='btn btn-outline-danger btn-rounded'
            data-mdb-ripple-color='dark'
            onClick={() => removeBlog(blog)}
          >
            delete
          </button>
        )}
      </div>
    </div>
  )
}

Blog.propType = {
  blog: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired,
}
export default Blog
