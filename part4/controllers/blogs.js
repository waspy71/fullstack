const blogsRouter = require('express').Router()
const Blog = require('../models/blog')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)  
})
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: request.user._id
  })
  
  let savedBlog = await blog.save()
  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()
  savedBlog = await Blog.findById(savedBlog._id).populate('user')
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if ( !request.user || blog.user.toString() !== request.user._id.toString()) {
    return response.status(400).json({ error: 'must be the creator of the blog' })
  } 

  request.user.blogs = request.user.blogs.filter(b => b.toString() !== blog._id.toString())
  await request.user.save()
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()


})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, user } = request.body

  let blogUpdate = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes, user },
    { new: true, runValidators: true, context: 'query' }
  )

  blogUpdate = await Blog.findById(blogUpdate._id).populate('user')

  console.log('server blogupdate', blogUpdate)
  response.json(blogUpdate)


})

blogsRouter.post('/:id/comments', async (request, response) => {
  const comment = request.body.comment

  const blog = await Blog.findById(request.params.id)
  // console.log('REQUESTED Blog to check', blog)
  // console.log('Comment', comment)

  const blogComment =
    await Blog.findByIdAndUpdate(
      request.params.id,
      { 
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
        user: blog.user,
        comments: [...blog.comments, comment]
       },
       { new: true, runValidators: true, context: 'query' }
    )
    response.status(201).json(blogComment)

})

module.exports = blogsRouter