const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('requesting blogs', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('checking qunique id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('checking if posting works', async () => {
    const newBlog = {
        title: "Finding yourself",
        author: "Mobby Dick",
        url: "https://atthesea.com",
        likes: 1
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).toContain(
        'Finding yourself'
    )
})

test('setting missing "like" property to 0', async () => {
    const newBlog = {
        title: "Finding yourself",
        author: "Mobby Dick",
        url: "https://atthesea.com",
    }

    const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    expect(result.body.likes).toBe(0)
})

test('if missing title/url properties, 400 bad request', async () => {
    const newBlogNoUrl = {
        title: "Finding yourself",
        author: "Mobby Dick",
        likes: 8
    }

    const newBlogNoTitle = {
        author: "Mobby Dick",
        url: "https://atthesea.com",
        likes: 7
    }

    await api
        .post('/api/blogs')
        .send(newBlogNoTitle)
        .expect(400)

    await api
        .post('/api/blogs')
        .send(newBlogNoUrl)
        .expect(400)   
})

test('blog deletion returns 204', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
    )

    const contents = blogsAtEnd.map(b => b.id)

    expect(contents).not.toContain(blogToDelete.id)
})

test('blog updates properly', async () => {
    const blogsAtStart = await helper.blogsInDb()
    let blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes = 101

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
    
    const blogsAfterUpdate = await helper.blogsInDb()
    expect(blogsAfterUpdate[0].likes).toBe(blogToUpdate.likes)

})

afterAll(async () => {
    await mongoose.connection.close()
})