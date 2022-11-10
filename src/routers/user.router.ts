import express, { Router } from "express";
import User from "../models/user";
import bcrypt from 'bcrypt';
import { generateToken, checkAuthentication, getUsername } from '../utils/jwt.util';

const router: Router = express.Router();


router.post('/', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.sendStatus(400);
        return;
    }
    if (await User.findOne({ username: req.body.username })) {
        res.sendStatus(403);
        return;
    }
    const user = new User({
        username: await req.body.username,
        password: await bcrypt.hash(req.body.password, 10),
        recoveryKey: req.body.recovery ? await bcrypt.hash(req.body.recovery, 10) : undefined,
        shortened: []
    })
    try {
        user.save();
        res.statusCode = 200;
        const generatedToken = await generateToken(req.body.username);
        res.json({ status: "OK", token: generatedToken });
    } catch (err) {
        res.sendStatus(500);
    }
});

router.post('/authenticate', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.sendStatus(400);
    } else {
        const user = await User.findOne({ username: req.body.username });
        if (!user || await bcrypt.compare(req.body.password, user.password) === false) {
            res.sendStatus(403);
        } else {
            const generatedToken = await generateToken(req.body.username);
            res.statusCode = 200;
            res.json({ message: "OK", data: { token: generatedToken, expires: Date.now() + 18000000 } });
        }
    }
});

router.use((req, res, next) => checkAuthentication(req, res, next));

router.get('/:username', async (req, res) => {
    const username = getUsername(req.headers.authorization);
    if (!username || username !== req.params.username) {
        return res.sendStatus(401);
    }
    const user = await User.findOne({ username: username });
    if (!user) {
        return res.sendStatus(404);
    }
    res.statusCode = 200;
    return res.json({ message: "OK", data: { shortened: user?.shortened } });
});

router.put('/', (req, res) => { });

router.delete('/:username', (req, res) => { })

export default router;