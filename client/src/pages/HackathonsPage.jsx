import React, { useState, useEffect } from 'react'
import { createHackathon, fetchHackathons } from '../services/hackathonService'

const HackathonsPage = () => {
    const [hackathons, setHackathons] = useState([])
    const [error, setError] = useState("")
    const [load, setLoad] = useState(true);
    const [formData, setFormData] = useState({
        "name": '',
        "venue": '',
        "cover_image": '',
        "regi_url": '',
        "description": '',
        "start_date": '',
        "end_date": '',
    });

    function handleFormChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
    e.preventDefault();

    try {
        await createHackathon(formData);

        const updatedData = await fetchHackathons();
        setHackathons(updatedData);

        alert("Hackathon created successfully");
    } catch (error) {
        console.error(error);
    }
}

    useEffect(() => {
        async function loadHackathons() {
            try {
                const data = await fetchHackathons();
                setHackathons(data);
            }
            catch (error) {
                setError(error.message);
            }
            finally {
                setLoad(false);
            }
        }
        loadHackathons();
    }, [])
    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>Hack Name:</label>
                <input type="text" name='name' value={formData.name} onChange={handleFormChange} />
                <label>Venue:</label>
                <input type="text" name='venue' value={formData.venue} onChange={handleFormChange} />
                <label>Cover Image:</label>
                <input type="text" name='cover_image' value={formData.cover_image} onChange={handleFormChange} />
                <label>Regi URL:</label>
                <input type="text" name='regi_url' value={formData.regi_url} onChange={handleFormChange} />
                <label>Description:</label>
                <input type="text" name='description' value={formData.description} onChange={handleFormChange} />
                <label>Start Date:</label>
                <input type="date" name='start_date' value={formData.start_date} onChange={handleFormChange} />
                <label>End date:</label>
                <input type="date" name='end_date' value={formData.end_date} onChange={handleFormChange} />
                <button type='submit'>Submit</button>
            </form>

            {load?'Loading hackathons':error?error:
       (hackathons.map((hackathon)=>{
        return(   
        <div key={hackathon.hack_id} className='user'>
            <p>{hackathon.name}</p> 
            <p>{hackathon.venue}</p>
            <p>{hackathon.cover_image}</p> 
            <p>{hackathon.regi_url}</p>
            <p>{hackathon.description}</p>
            <p>{hackathon.start_date}</p> 
            <p>{hackathon.end_date}</p>
          </div>  
       )})) }
       
        </>
    )
}

export default HackathonsPage