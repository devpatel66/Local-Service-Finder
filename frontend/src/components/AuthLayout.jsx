import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
function AuthLayout({childern,authentication}) {
    const navigate = useNavigate()
    const authStatus = useSelector(state => state.authStatus)
        // If authentication is required, and the user is not authenticated, redirect to the sign-in page.
        // If authentication is not required, and the user is authenticated, redirect to the home page.
        if(authentication && authStatus !== authentication){
            navigate('/signin')
        }
        else if(!authentication && authStatus !== authentication){
          navigate('/home')
        }
    useEffect(() => {
        
    },[authStatus,navigate])
  return {childern}
}

export default AuthLayout