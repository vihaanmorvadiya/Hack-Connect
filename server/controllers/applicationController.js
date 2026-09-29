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

export const createApplications= async (req, res) => {
    const { message, user_id, team_id } = req.body;
    if (!user_id || !team_id) {
        return res.status(400).json({ error: "User id and team id are required fields" })
    }
    const userQuery = 'SELECT EXISTS(SELECT 1 FROM users WHERE user_id = $1)'
    const teamQuery = 'SELECT hack_id FROM teams WHERE team_id = $1'
    const membershipQuery = 'SELECT EXISTS(SELECT 1 from team_members WHERE user_id=$1 AND hack_id=$2)'
    const appQuery = 'SELECT EXISTS (SELECT 1 from applications WHERE user_id=$1 and team_id=$2)'
    const sqlQuery = 'INSERT INTO applications (message,user_id,team_id)   VALUES($1,$2,$3) RETURNING *'
    const VALUES = [message, user_id, team_id];

    try {
        const userResult = await pool.query(userQuery, [user_id]);
        const teamResult = await pool.query(teamQuery, [team_id]);


        if (!userResult.rows[0].exists) {
            return res.status(404).json({ error: "User not found" })
        }

        if (teamResult.rows.length == 0) {
            return res.status(404).json({ error: "Team not found" })
        }

        const hack_id = teamResult.rows[0].hack_id;

        const membershipResult = await pool.query(membershipQuery, [user_id, hack_id]);
        const appResult = await pool.query(appQuery, [user_id, team_id]);

        if (membershipResult.rows[0].exists) {
            return res.status(400).json({ error: "You are already part of a team for this hackathon" });
        }

        if (appResult.rows[0].exists) {
            return res.status(400).json({ error: "You have already applied to this team" });
        }

        const result = await pool.query(sqlQuery, VALUES);
        res.status(201).json({
            message: "Application submitted succesfully",
            data: result.rows[0]
        })
    }
    catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: "Application submission unsuccesfull" })
    }
};
