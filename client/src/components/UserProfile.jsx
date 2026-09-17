

const UserProfile = (user) => {
  return (
    <div className="user">
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>College: {user.college}</p>
      <p>LinkedIn: {user.linkedin_url}</p>
    </div>
  )
}

export default UserProfile