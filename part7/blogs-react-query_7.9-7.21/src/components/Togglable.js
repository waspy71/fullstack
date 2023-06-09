import { useState } from 'react'
import PropTypes from 'prop-types'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button
          id='show-blog-button'
          onClick={toggleVisibility}
          className='btn btn-outline-dark btn-rounded m-2'
        >
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button
          id='hide-blog-button'
          onClick={toggleVisibility}
          className='btn btn-outline-dark btn-rounded m-2'
        >
          hide
        </button>
      </div>
    </div>
  )
}

Togglable.propTypes = { buttonLabel: PropTypes.string.isRequired }

export default Togglable
