import { useState, useEffect } from 'react'
import UserProfile from './components/UserProfile'


function App() {

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
  })
  const [userData, setUserData] = useState({
    "user_id": '',
  })

  const handleChange = (e) => {
    //setFormData({ ...formData, [e.target.name]: e.target.value });
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // async function handleSubmit(e) {
  //   e.preventDefault();

  //   try {
  //     const response = await fetch("http://localhost:3000/api/users", {
  //       method: 'POST',
  //       body: JSON.stringify(formData),
  //       headers: {
  //         "content-type": 'application/json; charset=UTF-8'
  //       }
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log("Success:", data);
  //       alert("Form submitted successfully!")
  //     }
  //     else {
  //       const error = await response.json();
  //       console.error('Server error:', error);
  //     }
  //     fetch("http://localhost:3000/api/users")
  //       .then((res) => res.json())
  //       .then((data) => setUsers(data))
  //       .then(() => setLoad(false))
  //       .catch((err) => {
  //         console.error("Error fetching data:", err);
  //         setLoad(false)
  //         setError("Failed to load users")
  //       })
  //   }
  //   catch (error) {
  //     console.error('Network error:', error);
  //   }

  // }

  async function getUser(e) {
    e.preventDefault();

    setUserLoad(true);
    setUser(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userData.user_id}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();

      
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
    finally{
      setUserLoad(false);
    }
  }



  // useEffect(() => {
  //   fetch("http://localhost:3000/api/users")
  //     .then((res) => res.json())
  //     .then((data) => setUsers(data))
  //     .then(() => setLoad(false))
  //     .catch((err) => {
  //       console.error("Error fetching data:", err);
  //       setLoad(false)
  //       setError("Failed to load users")
  //     })
  // }, [])

  return (
    <>
      {/* {load ? 'Loading users' : error ? error :
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
        <input type="text" name='name' value={formData.name} onChange={handleChange} />
        <label>Email:</label>
        <input type="text" name='email' value={formData.email} onChange={handleChange} />
        <label>College:</label>
        <input type="text" name='college' value={formData.college} onChange={handleChange} />
        <label>Contact_no:</label>
        <input type="text" name='contact_no' value={formData.contact_no} onChange={handleChange}/>
        <label>About:</label>
        <input type="text" name='about' value={formData.about} onChange={handleChange}/>
        <label>Github Link:</label>
        <input type="text" name='github_url' value={formData.github_url} onChange={handleChange}/>
        <label>Linkedin Link:</label>
        <input type="text" name='linkedin_url' value={formData.linkedin_url} onChange={handleChange}/>
        <label>Upload Resume:</label>
        <input type="file" name='resume_url' onChange={handleChange}/>
        <button type='submit'>Submit</button>
      </form> */}

      <form onSubmit={getUser}>
        <label>Enter User Id:</label>

        <input type='text' name='user_id' value={userData.user_id} onChange={handleChange} />
        <button type='submit'>Get user</button>
      </form>

      {userload?(<p>Loading user</p>):
      user?
      (
      <>
      <div>User:</div>
      <UserProfile user={user}/>
      </>):
      (<div>No user selected or found</div>)
      }

      {/* {user && (
        <div className="user">
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>College: {user.college}</p>
          <p>LinkedIn: {user.linkedin_url}</p>
        </div>
      )} */}

      
    </>
  )
}


export default App
