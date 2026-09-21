import pool from '../db.js';

export const getAllUsers = async (req, res) => {
    const sqlQuery = 'SELECT * from users';
    try {
        const result = await pool.query(sqlQuery);

        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Database query error:', error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
        return res.status(400).json({ error: "Invalid UUID" });
    }

    const sqlQuery = `SELECT * FROM users WHERE user_id=$1`;
    try {
        const result = await pool.query(sqlQuery, [id]);
        if (result.rows.length == 0) {
            return res.status(404).json({ error: "No user found" });
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Database query error", error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createUser = async (req, res) => {
    const { name, email, contact_no, college, about, github_url, linkedin_url, resume_url } = req.body;
    if (!name || !email || !college) {
        return res.status(400).json({ error: "Name,email and college name are required fields" })
    }

    const sqlQuery = 'INSERT INTO users (name,email,contact_no,college,about,github_url,linkedin_url,resume_url)   VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *'

    const VALUES = [name, email, contact_no, college, about, github_url, linkedin_url, resume_url];
    try {
        const result = await pool.query(sqlQuery, VALUES);
        res.status(201).json({
            message: "User created succesfully",
            data: result.rows[0]
        })
    }
    catch (error) {
        console.error("Database query error:", err);
        res.status(500).json({ error: "User creation unsuccesfull" })
    }
};
