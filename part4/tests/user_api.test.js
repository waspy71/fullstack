const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

test('invalid users (no password) are not created, with status code 400', async () => {
    const userLackingPass = {
        username: "Tee",
        name: "Trevor"
    }

    const result = await api
        .post('/api/users')
        .send(userLackingPass)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be at least 3 characters long')
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
})

test('invalid users (no username) are not created, with status code 400', async () => {
    const userLackingUsername = {
        name: "Trevor",
        password: "qwer"
    }

    const result = await api
        .post('/api/users')
        .send(userLackingUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(`\`username\` is required`)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
})

test('users with username that is less than 3 characters are not created', async () => {
    const userShortUsername = {
        username: "T",
        name: "Trevor",
        password: "qwer"
    }

    const result = await api
        .post('/api/users')
        .send(userShortUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain(`\`username\` (\`${userShortUsername.username}\`) is shorter than the minimum allowed length `)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
})

test('users with password that is less than 3 characters are not created', async () => {
    const userShortUsername = {
        username: "T",
        name: "Trevor",
        password: "qw"
    }

    const result = await api
        .post('/api/users')
        .send(userShortUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password must be at least 3 characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
})

test('already existing/unique users are not created', async () => {
    const userUnique = {
        username: "Sum Ting Wong",
        name: "Should be only Wong",
        password: "zxcv"
    }

    const usersAtStart = await helper.usersInDb()

    const result = await api
        .post('/api/users')
        .send(userUnique)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        const contents = usersAtEnd.map(u => u.name)
        expect(contents).not.toContain(
            'Should be only Wong'
        )
})

afterAll( async () => {
    await mongoose.connection.close()
})






