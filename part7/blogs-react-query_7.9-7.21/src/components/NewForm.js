import { useState } from 'react'
import PropTypes from 'prop-types'

import { Form } from 'react-bootstrap'

const NewForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h3>Create new blog</h3>
      <form onSubmit={handleBlog}>
        <Form.Group>
          <div>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type='text'
              name='title'
              placeholder='title'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div>
            <Form.Label>Author</Form.Label>
            <Form.Control
              type='text'
              name='author'
              placeholder='author'
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
            />
          </div>
          <div>
            <Form.Label>URL</Form.Label>
            <Form.Control
              type='text'
              name='url'
              placeholder='url'
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </div>
          <button
            id='create-blog-button'
            type='submit'
            className='btn btn-outline-success btn-rounded m-2'
          >
            Create
          </button>
        </Form.Group>
      </form>
    </div>
  )
}

NewForm.propType = { createBlog: PropTypes.func.isRequired }

export default NewForm
