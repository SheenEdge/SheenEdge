import { createSlice } from '@reduxjs/toolkit'

export interface UserState {
  name: string | null,
  _id: string | null,
  email: string | null,
}

const initialState: UserState = {
    name: null,
    _id: null,
    email: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDet: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.name = action.payload.name;
      state._id = action.payload._id;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.name = null;
      state._id =null;
      state.email=null;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUserDet, logout } = userSlice.actions

export default userSlice.reducer