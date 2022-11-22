import express, { Router } from "express";
import User, { IUser } from "../models/user";
import bcrypt from 'bcrypt';
import { generateToken, checkAuthentication, getUsername } from '../utils/jwt.util';

const router: Router = express.Router();
router.use(express.json())
router.use(express.text())
/**
 * While waiting on swagger implementation:
 * Registers a new user
 */

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

/**
 * While waiting on swagger implementation:
 * Authenticates user based on their username and password:
 * Returns them a JWT that is valid for 5 hours
 */

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
            res.json({ status: "OK", token: generatedToken });
        }
    }
});

/**
 * While waiting on swagger implementation
 * Checks if a user exists based on the username provided
 */

router.get('/exists/:username', async (req, res) => {
    if (!req.params.username) return res.sendStatus(400);
    if ((RegExp(/^[\d\w0-9A-Za-z\-]+$/).test(String(req.params.username))) !== true) return res.sendStatus(400);
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.sendStatus(200);
    else return res.sendStatus(409)
})

router.use((req, res, next) => checkAuthentication(req, res, next));

/**
 * While waiting on swagger implementation:
 * Fetches the user's shortened URLs (All of them)
 */

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

/**
 * While waiting on swagger implementation:
 * Fetches the user's basic info
 */


router.get('/:username/basic', async (req, res) => {
    const username: string = getUsername(req.headers.authorization);
    if (!username || username !== req.params.username) {
        return res.sendStatus(401);
    }
    const user: IUser | null = await User.findOne({ username: username });
    if (!user) {
        return res.sendStatus(404);
    }
    res.statusCode = 200;
    return res.json({ message: "OK", data: { username: user.username, hasRecoveryKey: user.recoveryKey ? true : false, nShortens: user.shortened.length } });
});

/**
 * While waiting on swagger implementation:
 * Allows the user to change their password
 */

router.put('/', async (req, res) => {
    if (!req.body.password) return res.sendStatus(400);
    const username = getUsername(req.headers.authorization);
    const user = await User.findOne({ username: username });
    if (!user) return res.sendStatus(404);
    try {
        user.password = await bcrypt.hash(req.body.password, 10);
        user.save();
        return res.sendStatus(200);
    }
    catch (e) {
        return res.sendStatus(500)
    }

});

/**
 * While waiting on swagger implementation:
 * Allows the user to delete their account
 */

router.delete('/:username', async (req, res) => {
    const username = getUsername(req.headers.authorization);
    if (!username || username !== req.params.username) return res.sendStatus(401);
    try {
        const user = await User.findOne({ username: username });
        if (!user) return res.sendStatus(404);
        user.delete();
        res.sendStatus(200);
    } catch (e) {
        return res.sendStatus(500);
    }
})

export default router;