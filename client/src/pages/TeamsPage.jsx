import React from 'react'
import { useState } from 'react'
import { createTeam, fetchTeamById, fetchTeams } from '../services/teamService'
import { fetchHackathons } from '../services/hackathonService'
import { useEffect } from 'react'
import { createApplication } from '../services/applicationService'

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

    const [appData,setAppData] = useState({
        "team_id":'',
        "user_id":'',
        "message":''
    })


    const [createError, setCreateError] = useState("");
    const [createSuccess, setCreateSuccess] = useState(false);

    const [appError,setAppError] = useState("")

    const [selectedHackID, setSelectedHackId] = useState("")

    const [hacks, setHacks] = useState([]);
    const [hackerr, setHackerr] = useState("")
    const [hackload, setHackload] = useState("")
    const [selectedTeamId, setSelectedTeamId] = useState("");

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleAppFormChange = (e) => {
        setAppData({ ...appData, [e.target.name]: e.target.value });
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

    async function handleApply(teamId){
        setSelectedTeamId(teamId);

        setAppData({
            team_id:teamId,
            user_id:'',
            message:''
        });

        setAppError("");
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

    async function handleAppSubmit(e){
        e.preventDefault();
        setAppError("");

        try{
            await createApplication(appData);
            alert("Application submitted successfully");

            setAppData({
            team_id: "",
            user_id: "",
            message: ""
            });
            
            setSelectedTeamId("");
        }
        catch(error){
            setAppError(error.message);
            console.error(error);
        }
    }

    useEffect(() => {
        async function loadHackathons() {
            setHackload("Loading hackathons")
            setHackerr("")
            try {
                const data = await fetchHackathons();
                setHacks(data);
            }
            catch (error) {
                setHackerr(error.message)
                console.log(error)
            }
            finally {
                setHackload("");
            }
        }
        loadHackathons();
    }, [])


    return (
        <>
            {hackload
                ? hackload
                : hackerr
                    ? hackerr
                    : hacks.length === 0
                        ? "No hackathons available"
                        : null}
            {/* <label>Hack ID:</label>
            <input type="text" value={hackId} onChange={(e)=>setHackId(e.target.value)} placeholder="Enter Hackathon ID" /> */}
            <select value={selectedHackID} onChange={(e) => setSelectedHackId(e.target.value)}>
                <option value="">Select a hackathon:</option>
                {hacks.map((hack) => (
                    <option key={hack.hack_id} value={hack.hack_id}>{hack.name}</option>
                ))}
            </select>
            <button type='button' onClick={() => handlegetTeams(selectedHackID)} disabled={!selectedHackID || load}>Filter teams</button>

            <button onClick={() => handlegetTeams()} disabled={load}>
                {load ? "Loading..." : "Get Teams"}
            </button>

            {load ? "Loading teams" : error ? error : (
                teams.map((team) => {
                    return (
                        <div key={team.team_id} className='display'>
                            <p>Name:{team.team_name}</p>
                            <p>Max Members:{team.max_members}</p>
                            <button onClick={() => handleViewDetails(team.team_id)}>View Details</button>
                            <button onClick={() => handleApply(team.team_id)}>Apply to team</button>
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

            {selectedTeamId && (
            <form onSubmit={handleAppSubmit}>
                <label>User ID:</label>
                <input type="text" name='user_id' value={appData.user_id} onChange={handleAppFormChange}/>
                <label>Message:</label>
                <input type="text" name='message' value={appData.message} onChange={handleAppFormChange}/>
                <button type='submit'>Submit</button>
            </form>
            )}



            {createError && <p>{createError}</p>}
            {createSuccess && <p>Team created successfully!</p>}

            {selectedTeamId && <p>Selected team ID: {selectedTeamId}</p>}

            {appError&&<p>{appError}</p>}
            
            {/* <label>Enter ID:</label>
                <input type='text'></input>
                <button>Get Team</button> */}
        </>
    )
}

export default TeamsPage