import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    name: string;
    email: string;
    _id: string;
}

const initialState: UserState = {
    name: '',
    email: '',
    _id: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDet: (state, action: PayloadAction<UserState>) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state._id = action.payload._id;
        },
        clearUserDet: (state) => {
            state.name = '';
            state.email = '';
            state._id = '';
        },
    },
});

export const { setUserDet, clearUserDet } = userSlice.actions;
export default userSlice.reducer;
