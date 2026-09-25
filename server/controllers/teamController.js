import pool from "../db.js"

export async function getAllTeams(req, res) {
    const sqlQuery = "SELECT * FROM teams";
    try {
        const result = await pool.query(sqlQuery);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error("Database query error", err.stack)
        res.status(500).json({ error: "Internal server error" })
    }
};

export async function createTeam(req, res) {
    const { team_name, description, max_members, hack_id, leader_id } = req.body;
    if (!team_name || !max_members || !hack_id || !leader_id) {
        return res.status(400).json({ error: 'Team name,Team size,Hack_id and Leader_id are required fields' })
    }
    const hackQuery =
        'SELECT EXISTS(SELECT 1 FROM hackathons WHERE hack_id = $1)';

    const userQuery =
        'SELECT EXISTS(SELECT 1 FROM users WHERE user_id = $1)';
    if (max_members > 0) {
        return res.status(400).json({ error: 'Max members should be greater than 0' })
    }
    const hackResult = await pool.query(hackQuery, [hack_id]);
    const userResult = await pool.query(userQuery, [leader_id]);

    if (!hackResult.rows[0].exists) {
        return res.status(404).json({ error: 'Hackathon not found' });
    }

    if (!userResult.rows[0].exists) {
        return res.status(404).json({ error: 'Leader not found' });
    }
    const sqlQuery = 'INSERT INTO teams(team_name,description,max_members) VALUES($1,$2,$3) RETURNING *'
    const VALUES = [team_name, description, max_members]
    try {
        const result = await pool.query(sqlQuery, VALUES);
        res.status(201).json({
            message: "New team created successfully",
            data: result.rows[0]
        })
    }
    catch (err) {
        console.error("Database query error:", err);
        res.status(500).json({ error: "Team creation unsuccesful" })
    }
};