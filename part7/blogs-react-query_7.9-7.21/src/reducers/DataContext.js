import { useReducer, useContext, createContext } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'info':
      return action.payload
    case 'error':
      return action.payload
    case 'reset':
      return null
    default:
      return state
  }
}

const loginReducer = (state, action) => {
  switch (action.type) {
    case 'USER':
      return { ...state, user: action.payload }
    case 'USERNAME':
      return { ...state, username: action.payload }
    case 'PASSWORD':
      return { ...state, password: action.payload }
    case 'LOGOUT':
      return { user: null, username: '', password: '' }
    default:
      return state
  }
}

const NotificationContext = createContext()
const LoginContext = createContext()

export const ContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )
  const [login, loginDispatch] = useReducer(loginReducer, {
    user: null,
    username: '',
    password: '',
  })

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      <LoginContext.Provider value={[login, loginDispatch]}>
        {props.children}
      </LoginContext.Provider>
    </NotificationContext.Provider>
  )
}

export const loginHandler = () => {
  const loginAndDispatch = useContext(LoginContext)
  const dispatch = loginAndDispatch[1]
  const loginUser = userLoginDispatch()
  const notify = useNotificationDispatch()
  return async (username, password) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      loginUser(user)
      dispatch({ type: 'USERNAME', payload: '' })
      dispatch({ type: 'PASSWORD', payload: '' })
    } catch (exception) {
      notify(exception.response.data.error, 'error')
      console.log(exception.response.data.error)
    }
  }
}

export const userValue = () => {
  const loginAndDispatch = useContext(LoginContext)
  return loginAndDispatch[0]
}

export const userLoginDispatch = () => {
  const loginAndDispatch = useContext(LoginContext)
  const dispatch = loginAndDispatch[1]
  return (user) => {
    dispatch({ type: 'USER', payload: user })
    blogService.setToken(user.token)
  }
}

export const userUsernameDispatch = () => {
  const loginAndDispatch = useContext(LoginContext)
  const dispatch = loginAndDispatch[1]
  return (username) => {
    dispatch({ type: 'USERNAME', payload: username })
  }
}

export const userPasswordDispatch = () => {
  const loginAndDispatch = useContext(LoginContext)
  const dispatch = loginAndDispatch[1]
  return (password) => {
    dispatch({ type: 'PASSWORD', payload: password })
  }
}

export const userLogoutDispatch = () => {
  const logoutAndDispatch = useContext(LoginContext)
  const dispatch = logoutAndDispatch[1]
  return () => {
    dispatch({ type: 'LOGOUT' })
  }
}

export const useNotificationValue = () => {
  const notifyAndDispatch = useContext(NotificationContext)
  return notifyAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notifyAndDispatch = useContext(NotificationContext)
  const dispatch = notifyAndDispatch[1]
  return (message, type = 'info') => {
    const notifyInfo = { type, payload: { message, error: type } }
    dispatch(notifyInfo)

    setTimeout(() => {
      dispatch({ type: 'reset' })
    }, 5000)
  }
}

export default Notification
