import React from 'react'
import { Button } from '../index'

function Popup({ errMsg="",title="Important Alert",msg,btnText = "Yes",btnFunc=()=>{},btnCloseFunc=()=>{},children}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-10 z-50">
            <div className="bg-white rounded-lg p-5 shadow-xl w-full max-w-md mx-auto overflow-hidden">
                
            <p className='text-black font-semibold text-xl'>{title}</p>
            <p>{msg}</p>
            {children}
            {errMsg  && <p className='text-red-500'>{errMsg}</p>}
            <div className='flex justify-end gap-4 w-full mt-5'>
                <Button textColor='text-black' onClick={btnCloseFunc} className='border rounded-xl px-2 py-1 w-1/4 hover:bg-gray-100'>Cancel</Button>
                {btnText && <Button textColor='text-white' className='bg-black px-2 py-1  hover:bg-gray-800' onClick={btnFunc}>{btnText}</Button>}
            </div>
            </div>
        </div>
    )
}

export default Popup