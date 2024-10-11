import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const loginUser=createAsyncThunk(
    'user/loginUser',
    async(userCredencials)=>{
        const request = await  axios.post(`http://localhost:5800/api/user/login`,userCredencials);
        const response = await request.data.data;
        localStorage.setItem('user',JSON.stringify(response));
        return response;

    }
)

const userSlice = createSlice({
    name: 'user' ,
    initialState:{
        loading : false ,
        id : null,
        erorr: null,
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.loading = true ;
            state.user= null;
            state.error = null ;
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.loading = false ;
            state.user= action.payload;
            state.error = null ;
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading = false ;
            state.user= null;
            console.log(action.error.message);
            if(action.error.message==='Reguest failed with status  code 401'){
                state.error = 'Invalid user or password' ;
            }
            else{
                state.error = action.error.message;
            }

            
        })
    }
});

export default userSlice.reducer;
