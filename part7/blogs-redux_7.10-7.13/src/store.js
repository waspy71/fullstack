import { configureStore } from '@reduxjs/toolkit'

import notificationReducer from './reducers/notificationReducer'
import blogsReducer from './reducers/blogsReducer'
import signedinReducer from './reducers/signedinReducer'

const store = configureStore({
  reducer: {
    info: notificationReducer,
    blogs: blogsReducer,
    signedIn: signedinReducer
  }
})

export default store