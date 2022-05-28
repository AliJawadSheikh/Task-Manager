const express = require('express');
require('./db/mongoose');
const User = require('./models/user')
const Task = require('./models/task')

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

//------------------------------------
// User APIs
//------------------------------------

app.post('/users', async(req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/users', async(req, res) => {
    try {
        const users = await User.find({})
        res.status(201).send(users)
    } catch (e) { res.status(500).send() }
})

app.get('/users/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user)
            return res.status(404).send();
        res.send(user);
    } catch (e) { res.status(500).send(e) };
})

app.patch('/users/:id', async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation)
        return res.status(400).send('Error: Invalid Updates');

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!user)
            return res.status(404).send();
        res.send(user)
    } catch (e) { res.status(400).send(e); }
})

app.delete('/users/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user)
            return res.status(404).send();
        res.send(user)
    } catch (e) { res.status(500).send() }
})

//------------------------------------
// Task APIs
//------------------------------------

app.post('/tasks', async(req, res) => {
    try {
        const task = await new Task(req.body).save()
        res.status(200).send(task)
    } catch (e) { res.status(400).send(e) }
})

app.get('/tasks', async(req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(201).send(tasks)
    } catch (e) { res.status(500).send() }
})

app.get('/tasks/:id', async(req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task)
            return res.status(404).send();
        res.send(task);
    } catch (e) { res.status(500).send(e) };
})

app.patch('/tasks/:id', async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation)
        return res.status(400).send('Error: Invalid Updates.');

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!task)
            return res.status(404).send();
        res.status(200).send(task);
    } catch (e) { res.status(500).send() }
})

app.delete('/tasks/:id', async(req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task)
            return res.status(404).send();
        res.send(task)
    } catch (e) { res.status(500).send() }
})

//------------------------------------
// Server Configurations
//------------------------------------

app.listen(port, () => {
    console.log('Server has been started on port: ' + port)
})