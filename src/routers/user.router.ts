import express, { Router } from "express";

const router: Router = express.Router();

router.get('/info', (req, res) => { });

router.post('/new', (req, res) => { });

router.post('/authenticate', (req, res) => { });

router.put('/edit', (req, res) => { });

router.delete('/delete', (req, res) => { })

module.exports = router;