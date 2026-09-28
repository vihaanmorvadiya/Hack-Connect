import pool from '../db.js';

export const getAllapplications = async (req, res) => {
    const sqlQuery = 'SELECT * from applications';
    try {
        const result = await pool.query(sqlQuery);

        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Database query error:', error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createApplications = async (req, res) => {
    const { message,user_id,team_id } = req.body;
    if (!user_id || !team_id) {
        return res.status(400).json({ error: "Status,user id and team id are required fields" })
    }

    const sqlQuery = 'INSERT INTO applications (message,user_id,team_id)   VALUES($1,$2,$3) RETURNING *'

    const VALUES = [message,user_id,team_id];
    try {
        const result = await pool.query(sqlQuery, VALUES);
        res.status(201).json({
            message: "Application submitted succesfully",
            data: result.rows[0]
        })
    }
    catch (error) {
        console.error("Database query error:", err);
        res.status(500).json({ error: "Application submission unsuccesfull" })
    }
};
