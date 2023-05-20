import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        notify(state, action) {
            return `Like added to: ${action.payload}`
        },
        notifyReset(state, action) {
            return null
        }
    }
})

export const { notifyCreate, notify, notifyReset } = notificationSlice.actions

export const setNotification = (content, time) => {
    return dispatch => {
        dispatch(notify(content))
        setTimeout(() => {
            dispatch(notifyReset())
        }, time * 1000)
    }
}

export default notificationSlice.reducer