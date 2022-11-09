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

router.get('/compare/:id', (req,res) => {
    bcrypt.compare(req.params.id, "$2b$10$YE1L39epVx5cl/JvXEP2jekJ7Hi/CH5kwYSzsFeYbXDrWxnhaCob6").then((res) => console.log(res));
})

router.delete('/:id', (req,res) => {});

router.get('/:id', (req,res) => {});

export default router;