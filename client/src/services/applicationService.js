export async function createApplication(appData){
    const response= await fetch("http://localhost:3000/api/applications",{
        method:'POST',
        body:JSON.stringify(appData),
        headers: {
            "Content-Type": "application/json"
        },
    })

    if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create application");
    }

    return response.json();
}

export async function getMyApplications(userId){
    const response = await fetch(`http://localhost:3000/api/applications/user/${userId}`)

    if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch applications")
    }

    return response.json();
}