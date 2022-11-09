// Imports
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import { ShortenedArrayT } from './src/types/ShortenedArray';
import User from './src/models/user';
// Setup
const app: express.Application = express();
const port: Number = 42069;
const host: String = "localhost";
require('dotenv').config()
// app.use(function (req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
// });
// app.use(cors());


// Routes
app.get('/ping', (req, res) => {
    res.json({status: 400, fuck: "yeah"})
})

fs.readdirSync(__dirname + '/src/models').forEach((file) => {
	if (~file.indexOf('.ts')) {
		require(`${__dirname}/src/models/${file}`);
		console.log(`• ${file} imported.`);
	}
})
console.log("• Waiting for mongodb...")
mongoose.connect(`${process.env.MONGO_URI}`, {
	authSource: "admin",
	user: process.env.MONGO_USER,
	pass: process.env.MONGO_PASS,
	serverSelectionTimeoutMS: 3000,
}, (err) => {
	err ? console.log(`• Could not connect to MongoDB server :( ${err.message}`) : console.log(`• Connected to MongoDBserver`);
})
const user = new User({
	username:"test",
	password:"test",
	recoveryKey:'test',
	shortened: []
})
user.save();
// Run
app.listen(port, () => {
    console.log(`••• Server running on port ${port} •••`);
})