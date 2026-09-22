export async function fetchHackathons(){
    const response = await fetch("http://localhost/api/hackathons");

    if(!response.ok){
        throw new Error("Failed to fetch hackathons")
    }

    return response.json();
}


export async function createHackathon(hackathonData){
    const response = await fetch("http://localhost/api/hackathons",{
        method:'POST',
        body:JSON.stringify(hackathonData),
        headers: {
            "Content-Type": "application/json"
        },
    })

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create hackathon")
        }
    
    return response.json();
}