require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./db.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => res.status(200).send("API working..!"));

app.post("/submit", async (req, res) => {
    const { ip_address, user_agent } = req.body;

    if (!ip_address || !user_agent) {
        return res.status(400).json({ message: "Missing IP or User-Agent" });
    }

    try {
        await db.query(
            `INSERT INTO ip.ip_logs (ip_address, user_agent) VALUES ($1, $2)`,
            [ip_address, user_agent]
        );
        res.json({ message: "IP successfully submitted!" });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ message: "Error inserting IP." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
