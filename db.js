const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "admin",
    database: "postgres",
    port: 5432,
});

// Log connection errors
pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});

// Test database connection on startup
pool.connect((err, client, release) => {
    if (err) {
        console.error("Error connecting to database", err.stack);
        process.exit(-1);
    }
    console.log("Connected to PostgreSQL database");
    release();
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};