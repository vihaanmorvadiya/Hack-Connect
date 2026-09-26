import pool from "../db.js"

export async function getAllHackathons(req,res) {
    const sqlQuery = "SELECT * FROM hackathons";
    try{
        const result = await pool.query(sqlQuery);
        res.status(200).json(result.rows);
    }
    catch(err){
        console.error("Database query error",err.stack)
        res.status(500).json({error:"Internal server error"})
    }
};

export async function createHackathon(req,res) {
    const {name,venue,cover_image,regi_url,description,start_date,end_date,min_team_size,max_team_size} = req.body;
    if(!name || !regi_url || !start_date || !end_date){
        return res.status(400).json({error:'Name,registartion link,start date and end date are required fields'})
    }
    if(!(min_team_size>0)){
        return res.status(400).json({error:"Minimum team size needs to be greater than zero"})
    }
    if(max_team_size<min_team_size){
        return res.status(400).json({error:'Max team size cannot be lesser than min team size'})
    }
    if(end_date<start_date){
        return res.status(400).json({error:'End date cannot be earlier than start date'})
    }
    const sqlQuery = 'INSERT INTO hackathons(name,venue,cover_image,regi_url,description,start_date,end_date) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *'
    const VALUES = [name,venue,cover_image,regi_url,description,start_date,end_date]
    try{
        const result = await pool.query(sqlQuery,VALUES);
        res.status(201).json({
            message:"New hackathon created successfully",
            data:result.rows[0]
        })
    }
    catch(err){
        console.error("Database query error:", err);
        res.status(500).json({error:"Hackathon creation unsuccesful"})
    }
};