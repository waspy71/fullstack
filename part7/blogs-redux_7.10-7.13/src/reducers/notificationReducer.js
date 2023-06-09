import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'info',
  initialState: { message: null },
  reducers: {
    setInfo(state, action) {
      return action.payload

    }
  }
})

export const { setInfo } = notificationSlice.actions

export const handleNotification = (message, type='info') => {
  return dispatch => {
    dispatch(setInfo({ message, type }))

    setTimeout(() => {
      dispatch(setInfo({ message: null }))
    }, 5000)
  }
}


export default notificationSlice.reducer