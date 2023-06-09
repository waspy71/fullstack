
import { useState } from 'react'
import PropTypes from 'prop-types'


const NewForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h3>Create new blog</h3>
      <form onSubmit={handleBlog}>
        <div>
                title
          <input
            type='text'
            name='title'
            placeholder='title'
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
            author
          <input
            type='text'
            name='author'
            placeholder='author'
            value={author}
            onChange={event => setAuthor(event.target.value)}
          />
        </div>
        <div>
            url
          <input
            type='text'
            name='url'
            placeholder='url'
            value={url}
            onChange={event => setUrl(event.target.value)}
          />
        </div>
        <button id='create-blog-button' type='submit'>Create</button>
      </form>
    </div>
  )
}

NewForm.propType = { createBlog: PropTypes.func.isRequired }

export default NewForm