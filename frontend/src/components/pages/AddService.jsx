import React, { useEffect } from 'react'
import { Outlet,useNavigate } from 'react-router'
import userAuth from '../../api/auth'
import { login } from '../../store/authSlice'
import { useSelector,useDispatch } from 'react-redux'

function AddService() {
  const authStatus = useSelector(state => state.authReducer.authStatus)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
      async function jwtLogin(){
        try {
          const response = await userAuth.jwtLogin();
          console.log(response);
          if (response.statusCode == 200) {
            dispatch(login(response.data))
          }
          else{            
            navigate('/')
          }
        } catch (error) {
          navigate('/')
        }
      }
      if(authStatus===false){
        jwtLogin()
      }
  },[])
  return (
    <div className=''>
      <Outlet />
    </div>
  )
}

export default AddService