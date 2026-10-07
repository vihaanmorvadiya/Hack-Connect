import React from 'react'
import { useState } from 'react'
import { createTeam, fetchTeamById, fetchTeams } from '../services/teamService'

const TeamsPage = () => {

    const [load, setLoad] = useState(false)
    const [error, setError] = useState("")
    const [teams, setTeams] = useState([])
    const [team, setTeam] = useState(null)
    const [loader, setLoader] = useState("")
    const [err, setErr] = useState("")
    const [formData, setFormData] = useState({
            "team_name": '',
            "description": '',
            "max_members": '',
            "hack_id": '',
            "leader_id": '',
        });
    const [createError, setCreateError] = useState("");

    const handleFormChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const handlegetTeams = async () => {
        setLoad(true);
        setError("");
        setTeam(null);
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

    async function handleViewDetails(teamId) {
        setLoader("Loading team");
        setErr("");

        try {
            const result = await fetchTeamById(teamId);
            setTeam(result);
        }
        catch (error) {
            setErr(error.message)
        }
        finally {
            setLoader("");
        }
    }

    async function handleSubmit(e){
        e.preventDefault();
        setCreateError("");

        try{
            await createTeam(formData);

            const updatedData = await fetchTeams();
            setTeams(updatedData);

            alert("Team created successfully");
        }
        catch(error){
            setCreateError(error.message);
            console.error(error)
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
                            {/* <p>Description:{team.description}</p> */}
                            <p>Max Members:{team.max_members}</p>
                            {/* <p>Hackathon ID:{team.hack_id}</p> */}
                            {/* <p>Leader ID:{team.leader_id}</p> */}
                            {/* <p>Created at:{team.created_at}</p> */}
                            <button onClick={() => handleViewDetails(team.team_id)}>View Details</button>
                        </div>
                    )
                }))}

            {loader ? loader : err ? err : team ? (
                <div className="display">
                    <p>Name: {team.team_name}</p>
                    <p>Description: {team.description}</p>
                    <p>Max Members: {team.max_members}</p>
                    <p>Hackathon ID: {team.hack_id}</p>
                    <p>Leader ID: {team.leader_id}</p>
                    <p>Created at: {team.created_at}</p>
                </div>
            ) : null}

            <form onSubmit={handleSubmit}>
                <label>Team Name:</label>
                <input type="text" name='team_name' value={formData.team_name} onChange={handleFormChange} />
                <label>Description:</label>
                <input type="text" name='description' value={formData.description} onChange={handleFormChange} />
                <label>Maximum members:</label>
                <input type="number" name='max_members' value={formData.max_members} onChange={handleFormChange} />
                <label>Hack ID:</label>
                <input type="text" name='hack_id' value={formData.hack_id} onChange={handleFormChange} />
                <label>Leader id:</label>
                <input type="text" name='leader_id' value={formData.leader_id} onChange={handleFormChange} />
                <button type='submit'>Submit</button>
            </form>


            {createError && <p>{createError}</p>}

            {/* <label>Enter ID:</label>
                <input type='text'></input>
                <button>Get Team</button> */}
        </>
    )
}

export default TeamsPage