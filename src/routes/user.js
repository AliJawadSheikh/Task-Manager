const express = require('express');
const router = new express.Router();
const User = require('../models/user')
const auth = require('../middlewares/auth')

router.post('/users', async(req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token })
    } catch (e) { res.status(400).send(e) }
})

router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.send({ user, token })
    } catch (e) { res.status(400).send(e) }
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save();
        res.send()
    } catch (e) { res.status(500).send() }
})

router.post('/users/logoutall', auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save()
        res.send()
    } catch (e) { res.status(500).send() }
})

router.get('/users/me', auth, async(req, res) => {
    try {
        res.status(200).send(req.user)
    } catch (e) { res.status(500).send() }
})

router.get('/users/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user)
            return res.status(404).send();
        res.send(user);
    } catch (e) { res.status(500).send(e) };
})

router.patch('/users/:id', async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation)
        return res.status(400).send('Error: Invalid Updates');
    try {
        const user = await User.findById(req.params.id)
        Object.assign(user, req.body)
        await user.save();
        if (!user)
            return res.status(404).send();
        res.send(user)
    } catch (e) { res.status(500).send(e) }
})

router.delete('/users/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user)
            return res.status(404).send();
        res.send(user)
    } catch (e) { res.status(500).send() }
})

module.exports = router;