// Imports
import express from "express";

// Setup
const app: express.Application = express();
const port: Number = 42069;
const host: String = "localhost";

// Routes
app.get('/ping', (req, res) => {
    res.json({status: 400, fuck: "yeah"})
})

// Run
app.listen(port, () => {
    console.log("Express typescript");
})