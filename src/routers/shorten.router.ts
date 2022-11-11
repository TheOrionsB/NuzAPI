import express, { Router } from "express";
import { ShortenedT } from "../types/Shortened";
import bcrypt from 'bcrypt';
require('dotenv').config();

const router: Router = express.Router();

router.get('/', async (req,res) => {
    const encpwd = await bcrypt.hash("bite", 10);
    const shorten: ShortenedT = {
        createdAt: new Date(),
        passwordProtected: true,
        source: "a89c",
        stats: {
            nHit: 0,
            hitHistory: [],
            lastHit: new Date()
        },
        isExpiringEnabled: false,
        ExpiresAt: new Date(),
        password: encpwd,
        target: 'https://google.com'
    }
    console.log(shorten);
    res.sendStatus(200);
});

router.delete('/:id', (req,res) => {});

router.get('/:id', (req,res) => {});

export default router;