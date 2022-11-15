import express, { Router } from "express";
import Shortened from "../types/Shortened";
import bcrypt from 'bcrypt';
import User from "../models/user";
import { validateShortened } from "../utils/shortened.util";
import { checkAuthentication } from "../utils/jwt.util";
import IShortened from "../types/Shortened";

require('dotenv').config();

const router: Router = express.Router();
router.use(express.json());
router.use((req, res, next) => checkAuthentication(req, res, next));

router.post('/', async (req, res) => {
    console.log(req.body)
    if (!req.body.username || !req.body.toshorten || !validateShortened(req.body.toshorten)) return res.sendStatus(400);
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
        res.json({success: true});
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
})

router.delete('/:id', (req, res) => { });

router.get('/:username', async (req, res) => {
    if (!req.params.username) return res.sendStatus(400);
    try {
        const user = await User.findOne({username: req.params.username})
        if (!user) return res.sendStatus(404);
        res.statusCode = 200;
        return res.json({shortened: user.shortened})
    } catch (e) {
        return res.sendStatus(500);
    }
});

export default router;