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

export const acceptApplication = async (req, res) => {
    const { id } = req.params;
    const { leader_id } = req.body;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
        return res.status(400).json({ error: "Invalid application UUID" });
    }

    if (!leader_id) {
        return res.status(400).json({ error: "Leader ID is required" });
    }

    try {
        const appQuery = 'SELECT user_id,team_id,status FROM applications WHERE app_id=$1';
        const appResult = await pool.query(appQuery, [id]);

        if (appResult.rows.length === 0) {
            return res.status(404).json({ error: "Application not found" });
        }

        const application = appResult.rows[0];
        const user_id = application.user_id;
        const team_id = application.team_id;
        const status = application.status;

        if (status !== "pending") {
            return res.status(400).json({ error: "Cannot accept this application" });
        }

        const teamQuery = 'SELECT hack_id,leader_id,max_members FROM teams WHERE team_id=$1';
        const teamResult = await pool.query(teamQuery, [team_id]);

        if (teamResult.rows.length === 0) {
            return res.status(404).json({ error: "Team not found" });
        }

        const team = teamResult.rows[0];
        const hack_id = team.hack_id;
        const actualLeaderId = team.leader_id;
        const max_members = team.max_members;

        if (actualLeaderId !== leader_id) {
            return res.status(403).json({ error: "Only the team leader can accept applications" });
        }

        const membershipQuery = 'SELECT EXISTS(SELECT 1 FROM team_members WHERE user_id=$1 AND hack_id=$2)';
        const membershipResult = await pool.query(membershipQuery, [user_id, hack_id]);

        if (membershipResult.rows[0].exists) {
            return res.status(400).json({ error: "User is already part of a team for this hackathon" });
        }

        const membersQuery = 'SELECT COUNT(*) FROM team_members WHERE team_id=$1';
        const membersResult = await pool.query(membersQuery, [team_id]);
        const currentMembers = Number(membersResult.rows[0].count);

        if (currentMembers >= max_members) {
            return res.status(400).json({ error: "Team is full" });
        }

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const memberQuery = 'INSERT INTO team_members(team_id,user_id,hack_id) VALUES($1,$2,$3)';
            await client.query(memberQuery, [team_id, user_id, hack_id]);

            const acceptQuery = "UPDATE applications SET status='accepted' WHERE app_id=$1";
            await client.query(acceptQuery, [id]);

            const rejectOtherQuery = `
                UPDATE applications
                SET status='rejected'
                WHERE user_id=$1
                AND status='pending'
                AND team_id IN(
                    SELECT team_id
                    FROM teams
                    WHERE hack_id=$2
                )
            `;
            await client.query(rejectOtherQuery, [user_id, hack_id]);

            await client.query("COMMIT");

            return res.status(200).json({ message: "Application accepted successfully" });
        }
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: "Could not accept application" });
    }
};

export const rejectApplication = async (req, res) => {
    const { id } = req.params;
    const { leader_id } = req.body;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
        return res.status(400).json({ error: "Invalid application UUID" });
    }

    if (!uuidRegex.test(leader_id)) {
        return res.status(400).json({ error: "Invalid leader UUID" });
    }

    if (!leader_id) {
        return res.status(400).json({ error: "Leader ID is required" });
    }

    try {
        const appQuery = 'SELECT team_id,status from applications WHERE app_id=$1'

        const appResult = await pool.query(appQuery, [id])

        if (appResult.rows.length == 0) {
            return res.status(404).json({ error: 'Application not found' })
        }

        const application = appResult.rows[0];

        const team_id = application.team_id;
        const status = application.status;

        if (status !== 'pending') {
            return res.status(400).json({ error: "Cannot reject this application" });
        }

        const teamQuery = 'SELECT leader_id from teams WHERE team_id=$1'

        const teamResult = await pool.query(teamQuery, [team_id]);

        if (teamResult.rows.length == 0) {
            return res.status(404).json({ error: "Team not found" })
        }
        const team = teamResult.rows[0];

        const actualLeaderId = team.leader_id;

        if (actualLeaderId !== leader_id) {
            return res.status(403).json({ error: "Only team leaders can reject applications" })
        }

        const rejectQuery = "UPDATE applications SET status='rejected' WHERE app_id=$1 AND status ='pending' RETURNING *";
        const rejectResult = await pool.query(rejectQuery, [id])

        if (rejectResult.rows.length === 0) {
            return res.status(409).json({
                error: "Application is no longer pending"
            });
        }

        return res.status(200).json({
            message: "Application rejected successfully",
            data: rejectResult.rows[0]
        });
    }

    catch (error) {
        console.error("Database query error:", error)
        return res.status(500).json({ error: "Could not reject this application" });
    }
}

