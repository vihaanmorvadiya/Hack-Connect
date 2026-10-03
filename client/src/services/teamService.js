export async function fetchTeams(){
    const response = await fetch("http://localhost:3000/api/teams")

    if(!response.ok){
        throw new Error("Failed to fetch teams")
    }

    return response.json();
}