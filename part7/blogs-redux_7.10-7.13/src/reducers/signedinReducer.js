import { createSlice } from '@reduxjs/toolkit'
import loginServices from '../services/login'
import blogService from '../services/blogs'
import { handleNotification } from './notificationReducer'

const signedInSlice = createSlice({
  name: 'signedIn',
  initialState: {
    username: '',
    password: '',
    user: null
  },
  reducers: {
    setUsername(state, action) {
      return { ...state, username: action.payload }
    },
    setPassword(state, action) {
      return { ...state, password: action.payload }
    },
    setUser(state, action) {
      return { ...state, user: action.payload }
    }
  }
})

export const { setUsername, setPassword, setUser } = signedInSlice.actions

export const loggedUserToken = (user) => {
  return dispatch => {
    dispatch(setUser(user))
    blogService.setToken(user.token)
  }
}
export const userLogin = (credentials) => {
  return async dispatch => {
    try {
      const user = await loginServices.login(credentials)

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      dispatch(setUser(user))
      dispatch(setUsername(''))
      dispatch(setPassword(''))
    } catch (exception) {
      dispatch(handleNotification(exception.response.data.error, 'error'))
      console.log(exception.response.data.error)
    }
  }
}

export default signedInSlice.reducer