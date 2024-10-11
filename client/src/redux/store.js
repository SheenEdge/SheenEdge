import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./Slice/login.js"

export const store = configureStore({
    reducer: {
        user : userReducer,

    },
  })


  export default store;