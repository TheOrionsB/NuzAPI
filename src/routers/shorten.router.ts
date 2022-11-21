import express, { Router } from "express";
import Shortened from "../types/Shortened";
import bcrypt from 'bcrypt';
import User, { IUser } from "../models/user";
import { validateShortened } from "../utils/shortened.util";
import { checkAuthentication } from "../utils/jwt.util";
import ShortenedQueue from "../models/shortenedqueue";

require('dotenv').config();

const router: Router = express.Router();
router.use(express.json());

const generateRandomShortened = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const generatedAt = new Date();
    let generated: string = '';
    for (let i: number = 0; i < 5; i++) {
        generated += chars.at(Math.floor(Math.random() * chars.length));
        generated.replace(generated[i], Math.round(Math.random()) === 0 ? generated[i].toLowerCase() : generated[i].toUpperCase());
    }
    generated += String(generatedAt.getTime()).substring(String(generatedAt.getTime()).length - 3);
    return generated;
}

const getUnusedShortened = async (): Promise<string> => {
    let valid = generateRandomShortened();
    const queue = await ShortenedQueue.find({ src: valid });
    const users = await User.find({ shortened: { source: valid } });
    if (queue.length > 0 || users.length > 0) return getUnusedShortened();
    return valid;
}

router.get('/new', async (req, res) => {
    const validShortened = await getUnusedShortened();
    try {
        const newQueueItem = new ShortenedQueue({
            src: validShortened,
            enteredQueueAt: new Date(),
            initiatedBy: req.query.user ? req.query.user : "Anonymous"
        })
        newQueueItem.save();
        res.statusCode = 200;
        res.json({ success: true, shortened: validShortened });
    } catch (e) {
        res.statusCode = 500;
        res.json({ success: false })
    }
})

router.use((req, res, next) => checkAuthentication(req, res, next));

router.post('/', async (req, res) => {
    if (!req.body.username || !req.body.toshorten || !validateShortened(req.body.toshorten)) return res.sendStatus(400);
    const users = await User.find({ "shortened.source": req.body.toshorten.source });
    if (users.length > 0) return res.sendStatus(409);
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.sendStatus(404);

    const newShortened: Shortened = {
        name: req.body.toshorten.name,
        createdAt: new Date(),
        isExpiringEnabled: req.body.toshorten.isExpiringEnabled,
        source: req.body.toshorten.source,
        target: req.body.toshorten.target,
        stats: {
            hitHistory: [],
            lastHit: new Date(),
            nHit: 0
        },
        passwordProtected: req.body.toshorten.passwordProtected,
        expiresAt: req.body.toshorten.isExpiringEnabled ? new Date(req.body.toshorten.expiresAt) : undefined,
        password: req.body.toshorten.passwordProtected ? await bcrypt.hash(req.body.toshorten.password, 10) : undefined
    }
    try {
        user?.shortened.push(newShortened);
        user?.save();
        res.statusCode = 200;
        res.json({ success: true });
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
})

router.delete('/:shortenedsuffix', async (req, res) => {
    const user = await User.findOne({ "shortened.source": req.params.shortenedsuffix });
    if (!user) return res.sendStatus(404);
    try {
        const shortenedIdx = user.shortened.findIndex(shortened => shortened.source === req.params.shortenedsuffix);
        user.shortened.splice(shortenedIdx, 1);
        user.save();
        return res.sendStatus(200);
    } catch {
        res.sendStatus(500);
    }
});

router.get('/:username', async (req, res) => {
    if (!req.params.username) return res.sendStatus(400);
    try {
        const user = await User.findOne({ username: req.params.username })
        if (!user) return res.sendStatus(404);
        res.statusCode = 200;
        return res.json({ shortened: user.shortened })
    } catch (e) {
        return res.sendStatus(500);
    }
});

router.get('/:username/top', async (req, res) => {
    if (!req.params.username) return res.sendStatus(400);
    let user;
    try {
        user = await User.findOne({ username: req.params.username })
        if (!user) return res.sendStatus(404);
        res.statusCode = 200;
    } catch (e) {
        return res.sendStatus(500);
    }
    const shortenedList: Array<Shortened> = user.shortened;
    shortenedList.sort((a, b) => b.stats.nHit - a.stats.nHit);
    return res.json({ status: 200, shortened: shortenedList.slice(0, 5) });
})

router.get('/:username/hithistory', async (req, res) => {
    if (!req.params.username) return res.sendStatus(400);
    let user;
    try {
        user = await User.findOne({ username: req.params.username });
        if (!user) return res.sendStatus(404);
        res.statusCode = 200;
    } catch (e) {
        return res.sendStatus(500);
    }
    let hitHistory: Array<Date> = [];
    for (let i = 0; i < user.shortened.length; i++) {
        hitHistory = [...hitHistory, ...user.shortened[i].stats.hitHistory]
    }
    return res.json({status: "OK", history: hitHistory})
})

export default router;