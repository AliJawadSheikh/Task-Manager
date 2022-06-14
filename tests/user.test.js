const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../src/models/user')

const userID = new mongoose.Types.ObjectId()
const UserOne = {
    _id: userID,
    name: 'Ali',
    email: 'rtuser1@gmail.com',
    password: 'rtuser0',
    tokens: {
        token: jwt.sign({ _id: userID }, process.env.JWT_SECRET)
    }
}

beforeEach(async() => {
    await User.deleteMany();
    await new User(UserOne).save();
})

test('Should Signup a New User', async() => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Ali',
            email: 'rtuser0@gmail.com',
            password: 'rtuser0'
        })
        .expect(201)
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBe(null);

    expect(response.body).toMatchObject({
        user: {
            name: 'Ali',
            email: 'rtuser0@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('rtuser0')
})

test('Should Login Existing User', async() => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: UserOne.email,
            password: UserOne.password
        })
        .expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Shouldn\'t Login User with Wrong Credentials', async() => {
    await request(app)
        .post('/users/login')
        .send({
            email: UserOne.email,
            password: UserOne.name
        })
        .expect(400)
})

test('Should Read User\'s Profile', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${UserOne.tokens.token}`)
        .expect(200)
})

test('Shouldn\'t Allow to Read User\'s Profile without Authentication Token', async() => {
    await request(app)
        .get('/users/me')
        .expect(401)
})

test('Should Delete Authenticated User\'s Profile', async() => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${UserOne.tokens.token}`)
        .expect(200)
    const user = await User.findById(UserOne._id)
    expect(user).toBeNull()
})

test('Shouldn\'t Delete Unauthenticated User\'s Profile', async() => {
    await request(app)
        .delete('/users/me')
        .expect(401)
})

test('Should upload the Avatar', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${UserOne.tokens.token}`)
        .attach('avatar', 'tests/fixtures/ajs-profile.jpg')
        .expect(200);

    const user = await User.findById(UserOne._id);
    expect(user.avatar).toEqual(expect.any(Buffer));
})

test('Should Update Valid User Fields', async() => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${UserOne.tokens.token}`)
        .send({
            name: 'Jawad Sheikh'
        })
        .expect(200)
    const user = await User.findById(UserOne._id)
    expect(response.body.name).toBe(user.name)
})

test('Should Not Update InValid User Fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${UserOne.tokens.token}`)
        .send({
            Company: 'Rolustech'
        })
        .expect(400)
})

test('Should Not Update Unauthenticated User Fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${UserOne.tokens.token.token}`)
        .send({
            name: 'Jawad Sheikh'
        })
        .expect(401)
})