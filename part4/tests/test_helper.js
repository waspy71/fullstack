const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
      },
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
      }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const initialUsers = [
  {
    username: "Sum Ting Wong",
    name: "Wong",
    password: "zxcv"
  },
  {
    username: "We Tu Lo",
    name: "Lo",
    password: "qwer"
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const authorizeUser = async (api) => {

  const user = {
    username: "Tom",
    name: "Tom",
    password: "1234"
  }

  await api
        .post('/api/users')
        .send({ username: user.username, name: user.name, password: user.password })

  const result = await api
      .post('/api/login')
      .send({ username: user.username, password: user.password })

  return result.body.token
}

module.exports = {
    initialBlogs, 
    initialUsers, 
    blogsInDb, 
    usersInDb, 
    authorizeUser
}