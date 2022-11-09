import express, { Router } from "express";

const router: Router = express.Router();

router.post('/new', (req,res) => {});

router.delete('/delete', (req,res) => {});

router.get('/statistics/:id', (req,res) => {});

router.get('/:id', (req,res) => {})

module.exports = router;