import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const updateLikes = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const likedBlog = {
    user: blog.user.id,
    likes: blog.likes + 1,
    author: blog.author,
    title: blog.title,
    url: blog.url
  }
  const request = await axios.put(`${baseUrl}/${blog.id}`, likedBlog, config)

  return request.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  const request = await axios.delete(`${baseUrl}/${id}`, config)

  return request.data
}

export default {
  getAll,
  setToken,
  create,
  updateLikes,
  deleteBlog
}