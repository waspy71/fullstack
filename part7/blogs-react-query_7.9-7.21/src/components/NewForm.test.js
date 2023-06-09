import React from 'react'
import { render, screen } from '@testing-library/react'
import NewForm from './NewForm'
import userEvent from '@testing-library/user-event'

test('checking createBlogs for right details', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<NewForm createBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('title')
  const inputAuthor = screen.getByPlaceholderText('author')
  const inputUrl = screen.getByPlaceholderText('url')

  const sendButton = screen.getByText('Create')

  await user.type(inputTitle, 'Grand Adventure')
  await user.type(inputAuthor, 'Tolkien')
  await user.type(inputUrl, 'https://tales.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Grand Adventure')
  expect(createBlog.mock.calls[0][0].author).toBe('Tolkien')
  expect(createBlog.mock.calls[0][0].url).toBe('https://tales.com')
})
