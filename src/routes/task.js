const express = require('express');
const router = new express.Router();
const Task = require('../models/task')

router.post('/tasks', async(req, res) => {
    try {
        const task = await new Task(req.body).save()
        res.status(200).send(task)
    } catch (e) { res.status(400).send(e) }
})

router.get('/tasks', async(req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch (e) { res.status(500).send() }
})

router.get('/tasks/:id', async(req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task)
            return res.status(404).send();
        res.send(task);
    } catch (e) { res.status(500).send(e) };
})

router.patch('/tasks/:id', async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation)
        return res.status(400).send('Error: Invalid Updates.');

    try {
        const task = await Task.findById(req.params.id)
        Object.assign(task, req.body)
        await task.save()

        if (!task)
            return res.status(404).send();
        res.status(200).send(task);
    } catch (e) { res.status(500).send() }
})

router.delete('/tasks/:id', async(req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task)
            return res.status(404).send();
        res.send(task)
    } catch (e) { res.status(500).send() }
})

module.exports = router;