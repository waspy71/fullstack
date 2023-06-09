import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlogs(state, action) {
      return state.concat(action.payload)
    },
    deleteBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    }
  }
})

export const { setBlogs, appendBlogs, deleteBlog, likeBlog } = blogsSlice.actions

export const getBlogs = () => {
  return async dispatch => {
    const blogsData = await blogService.getAll()
    dispatch(setBlogs(blogsData))
  }
}

export const blogCreate = (blogObject, user) => {
  return async dispatch => {
    const newBlog = await blogService.create(blogObject)
    newBlog.user = { name: user.name, username: user.username }
    dispatch(appendBlogs(newBlog))
  }
}

export const blogDelete = (id) => {
  return async dispatch => {
    await blogService.deleteBlog(id)
    dispatch(deleteBlog(id))
  }
}

export const blogLike = (blog) => {
  return async dispatch => {

    const likedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    await blogService.update(likedBlog, blog.id)
    const newBlogList = await blogService.getAll()
    dispatch(setBlogs(newBlogList))
  }
}


export default blogsSlice.reducer