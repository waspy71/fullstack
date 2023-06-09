import { useState } from 'react'
import PropTypes from 'prop-types'


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
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className='hidden'>
        {blog.title} {blog.author}
        <button  onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className='shown'>
        {blog.title} {blog.author}
        <button  onClick={toggleVisibility}>hide</button>
        <br></br>
        {blog.url}<br></br>
        likes {blog.likes}
        <button  onClick={() => handleLikes(blog)}>like</button>
        <br></br>
        {blog.user.name}
        <br></br>
        {blog.user.username === username &&
          <button  onClick={() => removeBlog(blog)}>delete</button>
        }
      </div>
    </div>
  )
}

Blog.propType = {
  blog: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired
}
export default Blog