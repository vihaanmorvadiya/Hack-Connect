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
    const [createSuccess, setCreateSuccess] = useState(false);


    const [selectedHackID,setSelectedHackId] =  useState("")


    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handlegetTeams = async (hackId = "") => {
        setLoad(true);
        setError("");
        setTeam(null);

        try {
            const data = await fetchTeams(hackId);
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

    async function handleSubmit(e) {
        e.preventDefault();
        setCreateError("");
        setCreateSuccess(false);

        try {
            await createTeam(formData);

            const updatedData = await fetchTeams();
            setTeams(updatedData);
            setCreateSuccess(true);
            alert("Team created successfully");
        }
        catch (error) {
            setCreateError(error.message);
            console.error(error)
        }
    }

    return (
        <>

            {/* <label>Hack ID:</label>
            <input type="text" value={hackId} onChange={(e)=>setHackId(e.target.value)} placeholder="Enter Hackathon ID" /> */}
            <select value={selectedHackID} onChange={(e)=>setSelectedHackId(e.target.value)}>
                <option value="">Select a hackathon:</option>
                <option value="38cf1ba6-6865-4a9e-be36-2edb0938200d">CodeStorm 2026</option>
                <option value="fea30a76-01f8-46a4-81c3-fda9a8ac7bad">Codehunt</option>
                <option value="1f0b69ba-2471-4799-b687-fb6a05620f0b">HelloWorld</option>
                <option value="35986865-62c5-4341-88ea-ed4683f62edc">Helloworld(1)</option>
                <option value="03450b03-6d85-46ad-b289-e25b2fa89c73">FirstBuild</option>
                <option value="cb3d2d67-236d-4c69-b9c7-f39a28a19d93">FirstHack</option>
                <option value="a9378b12-d542-4b33-aeb2-f06ec272bf16">Hack</option>
                <option value="9bf5e421-0b60-4a72-8251-873cac90b9cd">Hack(1)</option>
                <option value="6f30a5d0-30b2-41b5-ae93-72837fca93fb">HackNiche</option>
            </select>
            <button type='submit' onClick={()=>handlegetTeams(selectedHackID)}>Filter teams</button>

            <button onClick={()=>handlegetTeams()} disabled={!selectedHackID || load}>
                {load ? "Loading..." : "Get Teams"}
            </button>

            {load ? "Loading teams" : error ? error : (
                teams.map((team) => {
                    return (
                        <div key={team.team_id} className='display'>
                            <p>Name:{team.team_name}</p>
                            <p>Max Members:{team.max_members}</p>
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
            {createSuccess && <p>Team created successfully!</p>}

            {/* <label>Enter ID:</label>
                <input type='text'></input>
                <button>Get Team</button> */}
        </>
    )
}

export default TeamsPage