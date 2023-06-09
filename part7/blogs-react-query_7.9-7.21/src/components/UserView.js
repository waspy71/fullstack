const UserView = ({ userId, users }) => {
  if (users.isLoading) {
    return <div>loading data...</div>
  }

  if (users.isError) {
    return <div>user service not available due to problems in server</div>
  }

  const user = users.data.find((user) => user.id === userId)

  if (!user) {
    return <div>Sorry, unable to find such user</div>
  }
  return (
    <>
      <h2>{user.username}</h2>
      <br></br>
      <h4>Added blogs</h4>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  )
}

export default UserView
