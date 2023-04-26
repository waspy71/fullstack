const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
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

    const token = await helper.authorizeUser(api)

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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

    const token = await helper.authorizeUser(api)

    const result = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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

    const token = await helper.authorizeUser(api)

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogNoTitle)
        .expect(400)

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogNoUrl)
        .expect(400)   
})


test('blog deletion returns 204', async () => {
    const newBlog = {
        title: "Sherlock & Watson",
        author: "Artur Connan Doyle",
        url: "https://mystery.com",
        likes: 1
    }

    const token = await helper.authorizeUser(api)

    const result = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
    
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart.find(b => b.title === "Sherlock & Watson")

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
        blogsAtStart.length - 1
    )

    const contents = blogsAtEnd.map(b => b.id)

    expect(contents).not.toContain(blogToDelete.id)
})

test('blog updates properly', async () => {
    const newBlog = {
        title: "Sherlock & Watson",
        author: "Artur Connan Doyle",
        url: "https://mystery.com",
        likes: 1
    }

    const token = await helper.authorizeUser(api)

    const result = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
    
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart.find(b => b.title === "Sherlock & Watson")
     
    blogToUpdate.likes = 101

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogToUpdate)
        .expect(200)
    
    const blogsAfterUpdate = await helper.blogsInDb()
    const blogAfter = blogsAfterUpdate.find(b => b.title === "Sherlock & Watson")
    expect(blogAfter.likes).toBe(blogToUpdate.likes)

})

test('fails if unauthorized request with status code 401', async () => {
    const newBlog = {
        title: "Sherlock & Watson",
        author: "Artur Connan Doyle",
        url: "https://mystery.com",
        likes: 1
    }

    const result = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer `)
        .send(newBlog)
        .expect(401)
})

afterAll(async () => {
    await mongoose.connection.close()
})