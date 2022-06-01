const express = require('express');
const router = new express.Router();
const User = require('../models/user')
const auth = require('../middlewares/auth')
const multer = require('multer');
const sharp = require('sharp')

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/))
            cb(new Error('File Must a JPG or PNG'))
        cb(undefined, true)
    }
})

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

router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation)
        return res.status(400).send('Error: Invalid Updates');
    try {
        Object.assign(req.user, req.body)
        await req.user.save();
        res.send(req.user)
    } catch (e) { res.status(500).send(e) }
})

router.delete('/users/me', auth, async(req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) { res.status(500).send() }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
            width: 250,
            height: 250
        }).png()
        .toBuffer()

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (err, req, res, next) => res.status(400).send({ error: err.message }))

router.delete('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar)
            throw new Error()
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) { res.status(404).send() }
})

module.exports = router;