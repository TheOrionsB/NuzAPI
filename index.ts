// Imports
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import cleanQueue from './src/utils/queuecleanup.util';
import ShortenRouter from './src/routers/shorten.router';
import UserRouter from './src/routers/user.router';

// Setup
require('dotenv').config()
const app: express.Application = express();
const port: Number = 42069;
const host: String = "localhost";

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/user', UserRouter);
app.use('/api/shorten', ShortenRouter);
app.get('/api/ping', (req, res) => {
    res.json({msg: "Pong!"}).sendStatus(200);

})
fs.readdirSync(__dirname + '/src/models').forEach((file) => {
	if (~file.indexOf('.ts')) {
		require(`${__dirname}/src/models/${file}`);
		console.log(`• ${file} imported.`);
	}
})

setTimeout(() => cleanQueue(), 60000);

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