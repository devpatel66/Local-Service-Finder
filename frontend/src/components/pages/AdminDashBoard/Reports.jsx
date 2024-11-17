import React, { useEffect, useState } from 'react'
import reportApi from '../../../api/reportAPI'
import { Button } from '../../index'
import Popup from '../../utils/Popup';
import UserDetails from './User Management Section/UserDetails';
function Reports() {
    const [isDetailMenu, setIsDetailMenu] = useState(false)
    const [userId, setUserId] = useState(false)
    const [reports, setReports] = React.useState([])
    useEffect(() => {
        const fetchReports = async () => {
            const response = await reportApi.getReport()
            if (response.statusCode === 200) {
                // console.log(response);
                setReports(response.data)
            }
            else {
                console.log(response);
            }
        }
        fetchReports()
    })
    return (
        <>
            {
                isDetailMenu && <Popup title="User Details" btnText="" btnFunc={() => { setIsDetailMenu(false); setUserId(null) }} btnCloseFunc={() => setIsDetailMenu(false)}><UserDetails userId={userId} /></Popup>
            }
            <div className='w-full h-full bg-slate-200 gap-5 flex p-5 flex-col'>

                <p className='text-5xl font-bold px-5'>Reports</p>

                <div className='w-full flex flex-col p-10 gap-5  bg-white rounded-3xl'>
                    <p className='text-4xl'>Problem report</p>

                    <div className='w-full grid grid-cols-5  text-2xl text-center justify-between items-center border-b'>
                        <p className=' w-full'>Report ID</p>
                        <p className=' w-full'>Description</p>
                        <p className=' w-full'>Category</p>
                        <p className=' w-full'>Created At</p>
                        <p className=' w-full'>Actions</p>
                    </div>

                    {
                        reports && reports.length > 0 && reports.map((data, index) => (
                            <div key={index} className='w-full grid grid-cols-5 px-2 justify-between items-center py-2 text-center border-b'>
                                <p className='w-full' >{data.report_id}</p>
                                <p className='w-full break-words'>{data.description}</p>
                                <p className='w-full'>{data.category}</p>
                                <p className='w-full'>{data.createdAt?.slice(0, data.createdAt.indexOf("T"))}</p>
                                <div className='flex flex-col gap-2 items-center'>
                                    <Button onClick={() => { setIsDetailMenu(true); setUserId(data.user_id) }} textColor="text-white" className='w-1/2 hover:bg-[#8240f5] bg-[#6B17FF]'>View</Button>
                                </div>

                            </div>
                        ))
                    }


                    {/* <div className='w-full gap-2 flex justify-center items-center'>
                        <p>Next</p>
                        <p>Previous</p>
                    </div> */}
                </div>
                {/* End Second Section User List */}



            </div>
        </>
    )
}

export default Reports