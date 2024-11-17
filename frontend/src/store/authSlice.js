import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authStatus : false,
    userData : {},
    adminAuthStatus:false,
    adminData : {}
}  

export const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        login : (state, action) => {
            state.authStatus = true
            // console.log(action.payload);
            state.userData = action.payload
        },
        logout : (state) => {
            state.authStatus = false
            state.userData = {}
        },
        adminLogin:(state,action)=>{
            state.adminAuthStatus = true
            state.adminData = action.payload
        },
        adminLogout : (state) => {
            state.adminAuthStatus = false
            state.adminData = {}
        },
    }
})

export const {login, logout,adminLogin,adminLogout} = authSlice.actions

export default authSlice.reducer