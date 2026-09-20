import React from 'react'
import { useState, useEffect } from 'react'
import { createUser, fetchUserById, fetchUsers } from '../services/userService'
import UserProfile from '../components/UserProfile.jsx';

const UsersPage = () => {
    const [users, setUsers] = useState([])
    const [user, setUser] = useState(null)
    const [load, setLoad] = useState(true)
    const [userload, setUserLoad] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        "name": '',
        "email": '',
        "college": '',
        "contact_no": '',
        "about": '',
        "github_url": '',
        "linkedin_url": '',
        "resume_url": '',
    })
    const [userData, setUserData] = useState({
        "user_id": '',
    })

    const handleFormChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleUserIdChange = (e) => {
        setUserData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await createUser(formData);

            const updatedUsers = await fetchUsers();
            setUsers(updatedUsers);

            alert("User created successfully!");
        } catch (error) {
            console.error(error);
        }
    }

    async function handleGetUser(e) {
        e.preventDefault();

        setUserLoad(true);
        setUser(null);

        try {
            const data = await fetchUserById(userData.user_id);
            setUser(data);
        } catch (error) {
            console.error(error);
            setUser(null);
        } finally {
            setUserLoad(false);
        }
    }



    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoad(false);
            }
        }

        loadUsers();
    }, []);

    return (
        <>
            {load ? 'Loading users' : error ? error :
                (
                    users.map((user) => (
                        <div key={user.user_id} className='user'>
                            <p>Name:{user.name}</p>
                            <p>Email:{user.email}</p>
                            <p>College:{user.college}</p>
                            <p>Linkedin:{user.linkedin_url}</p>
                        </div>
                    )))
            }


            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" name='name' value={formData.name} onChange={handleFormChange} />
                <label>Email:</label>
                <input type="text" name='email' value={formData.email} onChange={handleFormChange} />
                <label>College:</label>
                <input type="text" name='college' value={formData.college} onChange={handleFormChange} />
                <label>Contact_no:</label>
                <input type="text" name='contact_no' value={formData.contact_no} onChange={handleFormChange} />
                <label>About:</label>
                <input type="text" name='about' value={formData.about} onChange={handleFormChange} />
                <label>Github Link:</label>
                <input type="text" name='github_url' value={formData.github_url} onChange={handleFormChange} />
                <label>Linkedin Link:</label>
                <input type="text" name='linkedin_url' value={formData.linkedin_url} onChange={handleFormChange} />
                <label>Upload Resume:</label>
                <input type="url" name='resume_url' value={formData.resume_url} onChange={handleFormChange} />
                <button type='submit'>Submit</button>
            </form>

            <form onSubmit={handleGetUser}>
                <label>Enter User Id:</label>

                <input type='text' name='user_id' value={userData.user_id} onChange={handleUserIdChange} />
                <button type='submit'>Get user</button>
            </form>

            {userload ? (<p>Loading user</p>) :
                user ?
                    (
                        <>
                            <div>User:</div>
                            <UserProfile user={user} />
                        </>) :
                    (<div>No user selected or found</div>)
            }
        </>
    )
}

export default UsersPage