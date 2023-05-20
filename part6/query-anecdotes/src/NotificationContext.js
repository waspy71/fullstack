import { createContext, useReducer, useContext } from 'react'

const notifyReducer = (state, action) => {
    switch(action.type) {
        case 'NOTIFY' :
            return action.payload
        case 'RESET' :
            return null
        default:
            return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notifyReducer, null)

    return (
        <NotificationContext.Provider value={ [notification, notificationDispatch] }>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotificationValue = () => {
    const notifyAndDispatch = useContext(NotificationContext)
    return notifyAndDispatch[0]
}

export const useNotificationDispatch = () => {
    const notifyAndDispatch = useContext(NotificationContext)
    return notifyAndDispatch[1]
}


export default NotificationContext