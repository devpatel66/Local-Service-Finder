import React from 'react'
import { Outlet } from 'react-router'
function AdminSection() {
  return (
    <div className='bg-slate-200 h-full'>
        <Outlet/>
    </div>
  )
}

export default AdminSection