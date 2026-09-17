// db.js
import pkg from 'pg';
import dotenv from 'dotenv';

// Initialize env config
dotenv.config();

const { Pool } = pkg;
const dbPassword = process.env.DB_PASSWORD; // Fixed typo in variable name

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'hack-connect',
    password: dbPassword, // Passed the actual variable, not a string literal
    port: 5432,
});

export async function connectDB() {
    try {
        const res = await pool.query('SELECT NOW()'); // Fixed dot to a space
        console.log('Database connected. Current time:', res.rows[0].now);
    } catch (err) {
        console.error("Connection error:", err.stack);
        process.exit(1); // Stop server if connection fails
    }
    // Removed pool.end() so the pool stays alive for your future API requests
}

export default pool;