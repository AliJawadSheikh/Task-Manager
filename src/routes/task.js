const express = require('express');
const router = new express.Router();
const Task = require('../models/task')
const auth = require('../middlewares/auth');

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
    const match = {}
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    if (req.query.completed)
        match.completed = req.query.completed === 'true'

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit) || 0,
                skip: parseInt(req.query.skip) || 0,
                sort
            },
        })
        res.status(200).send(req.user.tasks)
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