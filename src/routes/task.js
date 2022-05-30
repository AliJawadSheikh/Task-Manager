const express = require('express');
const router = new express.Router();
const Task = require('../models/task')
const auth = require('../middlewares/auth')

router.post('/tasks', auth, async(req, res) => {
    try {
        const task = await new Task({
            ...req.body,
            owner: req.user._id
        }).save()
        res.status(200).send(task)
    } catch (e) { res.status(400).send(e) }
})

router.get('/tasks', auth, async(req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id })
            // await req.user.populate('tasks').executePopulate()
            // const tasks = req.user.tasks
        res.status(200).send(tasks)
    } catch (e) { res.status(500).send() }
})

router.get('/tasks/:id', auth, async(req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!task)
            return res.status(404).send();
        res.send(task);
    } catch (e) { res.status(500).send(e) };
})

router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation)
        return res.status(400).send('Error: Invalid Updates.');

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task)
            return res.status(404).send();

        Object.assign(task, req.body)
        await task.save()

        res.status(200).send(task);
    } catch (e) { res.status(500).send() }
})

router.delete('/tasks/:id', auth, async(req, res) => {
    try {
        const task = await Task.deleteOne({
            _id: req.params.id,
            owner: req.user._id
        })
        if (task.deletedCount === 0)
            return res.status(404).send();
        res.send(task)
    } catch (e) { res.status(500).send() }
})

module.exports = router;