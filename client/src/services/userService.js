export async function fetchUsers(){
    const response = await fetch("http://localhost:3000/api/users");

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json();
}

export async function createUser(formData) {
    const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user");
    }

    return response.json();
}

export async function fetchUserById(id) {
    const response = await fetch(
        `http://localhost:3000/api/users/${id}`
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user");
    }

    return response.json();
}


// export async function fetchUserById(id) {
   
//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/users/${id}`
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error);
//       }

//       const data = await response.json();
//     } catch (error) {
//       console.error("Error fetching user:", error);
//     }
//     return response.json();
//   }



//   export async function createUser(formData) {
//      try {
//       const response = await fetch("http://localhost:3000/api/users", {
//         method: 'POST',
//         body: JSON.stringify(formData),
//         headers: {
//           "content-type": 'application/json; charset=UTF-8'
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Success:", data);
//         alert("Form submitted successfully!")
//       }
//       else {
//         const error = await response.json();
//         console.error('Server error:', error);
//       } 
//     }
//     catch (error) {
//       console.error('Network error:', error);
//     }

//   }