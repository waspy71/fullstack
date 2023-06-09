import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Users = ({ users }) => {
  if (users.isLoading) {
    return <div>loading data...</div>
  }

  if (users.isError) {
    return <div>user service not available due to problems in server</div>
  }

  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <tbody>
          <tr>
            <th>User</th>
            <th>Blogs</th>
          </tr>
          {users.data.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users
