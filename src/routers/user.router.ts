import express, { Router } from "express";
import User from "../models/user";
import bcrypt from 'bcrypt';
const router: Router = express.Router();

router.get('/', (req, res) => { });

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
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10),
        recoveryKey: req.body.recovery ? await bcrypt.hash(req.body.recovery, 10) : undefined,
        shortened: []
    })
    try {
        user.save();
        res.sendStatus(200);
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
            console.log("in first check");
            res.sendStatus(403);
        } else {
            const generatedToken = "ToBeGenerated"
            res.json({ message: "ok", data: { token: generatedToken, expires: Date.now() + 3600 } })
        }
    }
});

router.put('/', (req, res) => { });

router.delete('/', (req, res) => { })

export default router;