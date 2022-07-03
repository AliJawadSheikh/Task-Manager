const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task')
const { testUserOne, taskTwo, setupDB } = require('./fixtures/db')

beforeEach(setupDB);

test('Should Create Task for Users', async() => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${testUserOne.tokens.token}`)
        .send({
            description: 'Task Created via Jest'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.description).toEqual('Task Created via Jest')
});

test('Should Return User\'s All Tasks', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${testUserOne.tokens.token}`)
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Shouldn\'t Delete Unauthorized Task', async() => {
    await request(app)
        .delete(`/tasks/${taskTwo._id}`)
        .set('Authorization', `Bearer ${testUserOne.tokens.token}`)
        .send({
            _id: taskTwo._id,
            owner: taskTwo.owner
        })
        .expect(404)

    const task = await Task.findById(taskTwo._id)
    expect(task).not.toBeNull()
})