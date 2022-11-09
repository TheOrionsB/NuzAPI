import express from 'express'
const validateNew = (req: express.Request, res: express.Response, next: Function) => {
    if (!req.body.username || !req.body.password) {
        res.sendStatus(400);
    }
    next();
}

module.exports = {
    new: validateNew
}