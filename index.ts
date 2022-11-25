// Imports
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import cleanQueue from './src/utils/queuecleanup.util';
import ShortenRouter from './src/routers/shorten.router';
import UserRouter from './src/routers/user.router';
import User, { IUser } from './src/models/user';

// Setup
require('dotenv').config()
const app: express.Application = express();
const port: Number = Number(process.env.PORT) || 42069;
const host: String = process.env.HOST || "localhost";

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", process.env.CORS_HEADER_ORIGIN);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/user', UserRouter);
app.use('/api/shorten', ShortenRouter);
app.get('/api/ping', (req, res) => {
	res.json({ msg: "Pong!" }).sendStatus(200);

})
app.get('/:shortenedId', async (req, res) => {
	const user = await User.find({ "shortened.source": req.params.shortenedId });
	if (user.length !== 1) return res.redirect(`${process.env.CLIENT_URL}/nf?sf=${req.params.shortenedId}`);
	const selectedUser = user[0];
	const shortenedIdx: number = selectedUser.shortened.findIndex((shortened) => shortened.source === req.params.shortenedId);
	try {
		selectedUser.shortened[shortenedIdx].stats.lastHit = new Date();
		selectedUser.shortened[shortenedIdx].stats.nHit += 1;
		selectedUser.shortened[shortenedIdx].stats.hitHistory.push(new Date());
		selectedUser.markModified('shortened');
		await selectedUser.save();
	} catch (e) {
		console.log(e)
		return res.sendStatus(500).json({ status: 500, message: "INTERNAL SERVER ERROR" });
	}
	if (selectedUser.shortened[shortenedIdx].password) return res.redirect(`${process.env.CLIENT_URL}/pp?sf=${req.params.shortenedId}`)
	return res.redirect(selectedUser.shortened[shortenedIdx].target);
})
fs.readdirSync(__dirname + '/src/models').forEach((file) => {
	if (~file.indexOf('.ts')) {
		require(`${__dirname}/src/models/${file}`);
		console.log(`• ${file} imported.`);
	}
})

setInterval(() => cleanQueue(), 60000 * 5);

console.log("• Waiting for mongodb...")
mongoose.connect(`${process.env.MONGO_URI}`, {
	authSource: process.env.MONGO_AUTHSRC,
	user: process.env.MONGO_USER,
	pass: process.env.MONGO_PASS,
	serverSelectionTimeoutMS: 3000,
}, (err) => {
	err ? console.log(`• Could not connect to MongoDB server :( ${err.message}`) : console.log(`• Connected to MongoDBserver`);
})

// Run
app.listen(port, () => {
	console.log(`••• Server running on: http://${host}:${port} •••`);
})