export async function fetchTeams(){
    const response = await fetch("http://localhost:3000/api/teams")

    if(!response.ok){
        throw new Error("Failed to fetch teams")
    }

    return response.json();
}

export async function fetchTeamById(id) {
    const response = await fetch(
        `http://localhost:3000/api/teams/${id}`
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch team");
    }

    return response.json();
}

export async function createTeam(teamData){
    const response = await fetch("http://localhost:3000/api/teams",{
        method:'POST',
        body:JSON.stringify(teamData),
        headers: {
            "Content-Type": "application/json"
        },
    })

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create team")
        }
    
    return response.json();
}