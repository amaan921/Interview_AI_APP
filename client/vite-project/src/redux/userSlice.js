import { createSlice } from '@reduxjs/toolkit'


const userSlice= createSlice({
    name:'user',
    initialState:{
        currentUser: null,
    },
    reducers:{
        setCurrentUser:(state, action)=>{
            state.currentUser= action.payload;
        },
        updateCredits:(state, action)=>{
            if (state.currentUser) {
                state.currentUser.credits = action.payload;
            }
        },
        clearCurrentUser:(state)=>{
            state.currentUser= null;
        }
    }
})

export const { setCurrentUser, updateCredits, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
