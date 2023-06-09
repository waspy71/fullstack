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

const update = async (blog, id) => {
  console.log('update',blog)
  const config = {
    headers: { Authorization: token },
  }

  const request = await axios.put(`${baseUrl}/${id}`, blog, config)

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
  update,
  deleteBlog
}