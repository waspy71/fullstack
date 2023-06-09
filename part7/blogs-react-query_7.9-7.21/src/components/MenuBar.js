import { Link } from 'react-router-dom'

const Menu = () => {
  const padding = {
    paddingRight: 15,
  }
  return (
    <div className='navbar bg-dark p-3 mb-2 rounded'>
      <Link className='text-white' style={padding} to='/'>
        Blogs
      </Link>
      <Link className='text-white' style={padding} to='/users'>
        Users
      </Link>
    </div>
  )
}

export default Menu
