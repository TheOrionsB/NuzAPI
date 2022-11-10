import express from 'express';
import jwt from 'jsonwebtoken'

const signingOptions: jwt.SignOptions = { expiresIn: "5h" }

export const generateToken: Function = async (username: string) => {
    if (!process.env.APP_ENC) return ({ success: false, error: "No key present" });

    const token = await jwt.sign({ username: username }, process.env.APP_ENC, signingOptions);
    if (jwt.verify(token, process.env.APP_ENC))
        return (token);
    else
        generateToken(username);
}

export const checkAuthentication: Function = (req: express.Request, res: express.Response, next: Function) => {
    if (!req.headers.authorization?.includes("Bearer")) {
        res.sendStatus(401);
        return;
    }
    try {
        jwt.verify(req.headers.authorization!.split(" ")[1], process.env.APP_ENC!)
        next();
    } catch (e: any) {
        res.status(401).send({status: "Unauthorized", error: "Invalid or expired token"});
    }
    return;
}

export const getUsername: Function = (authHeader: string) => {
    const token: string = authHeader.split(" ")[1];
    const decoded = jwt.decode(token);
    return (Object(decoded).username);
}