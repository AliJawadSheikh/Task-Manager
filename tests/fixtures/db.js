const User = require('../../src/models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const Task = require('../../src/models/task');

const userOneID = new mongoose.Types.ObjectId()
const testUserOne = {
    _id: userOneID,
    name: 'Ali',
    email: 'rtuser1@gmail.com',
    password: 'rtuser0',
    tokens: {
        token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET)
    }
}

const userTwoID = new mongoose.Types.ObjectId()
const testUserTwo = {
    _id: userTwoID,
    name: 'Jawad',
    email: 'rtuser11@gmail.com',
    password: 'rtuser0!',
    tokens: {
        token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECRET)
    }
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Learning Node',
    completed: true,
    owner: userOneID
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Learning Laravel',
    owner: userTwoID
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Testing Node JS',
    completed: true,
    owner: userOneID
}

const setupDB = async() => {
    await User.deleteMany();
    await Task.deleteMany();

    await new User(testUserOne).save();
    await new User(testUserTwo).save();

    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    testUserOne,
    testUserTwo,
    taskTwo,
    setupDB
}