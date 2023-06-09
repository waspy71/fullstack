import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'Best blog',
    author: 'Best author',
    url: 'https://besturl.com',
    likes: 50,
    user: {
      name: 'Tom',
      username: 'Hanks',
    },
  }

  const username = 'Hanks'

  const mockHandler = jest.fn()
  const mockLikes = jest.fn()

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        removeBlog={mockHandler}
        username={username}
        handleLikes={mockLikes}
      />
    ).container
  })

  test('renders title/author but not the rest - by default', async () => {
    const divHidden = container.querySelector('.hidden')
    expect(divHidden).not.toHaveStyle('display: none')
    expect(divHidden).not.toHaveTextContent(`${blog.likes}`)

    const divShown = container.querySelector('.shown')
    expect(divShown).toHaveStyle('display: none')
    expect(divShown).not.toBeVisible()
  })

  test('renders url/likea after button view is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const divShown = container.querySelector('.shown')
    expect(divShown).toBeVisible()
    expect(divShown).toHaveTextContent(`${blog.url}`)
    expect(divShown).toHaveTextContent(`${blog.likes}`)
  })

  test('liked button was clicked twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)
    expect(mockLikes.mock.calls).toHaveLength(2)
  })
})
