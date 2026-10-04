import React from 'react'
import { useState } from 'react'
import { fetchTeams } from '../services/teamService'

const TeamsPage = () => {

    const [load, setLoad] = useState(false)
    const [error, setError] = useState("")
    const [teams, setTeams] = useState([])


    const handlegetTeams = async () => {
        setLoad(true);
        setError("");
        try {
            const data = await fetchTeams();
            setTeams(data);
        }
        catch (error) {
            setError(error.message)
        }
        finally {
            setLoad(false);
        }
    }

    return (
        <>
            <button onClick={handlegetTeams} disabled={load}>
                {load ? "Loading..." : "Get Teams"}
            </button>

            {load ? "Loading teams" : error ? error : (
                teams.map((team) => {
                    return (
                        <div key={team.team_id} className='display'>
                            <p>Name:{team.team_name}</p>
                            <p>Description:{team.description}</p>
                            <p>Max Members:{team.max_members}</p>
                            <p>Hackathon ID:{team.hack_id}</p>
                            <p>Leader ID:{team.leader_id}</p>
                            <p>Created at:{team.created_at}</p>
                        </div>
                    )
                }))}

                <label>Enter ID:</label>
                <input type='text'></input>
                <button>Get Team</button>
        </>
    )
}

export default TeamsPage