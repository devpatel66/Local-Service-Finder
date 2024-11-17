import React, { useState } from 'react'
import { FaAngleDown } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../../api/adminAPI';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../../../store/authSlice';

function AdminSidePannel() {
    const dispatch = useDispatch()
    const [subMenu, setSubMenu] = useState([])
    const navigate = useNavigate()
    const sidePanelMenu = [
        {
            title: "Overview/Statistics",
            link: ""
        },
        {
            title: "User Management",
            link: "user",
            // subMenu: [
            //     {
            //         title: "Service Providers",
            //         link: "user/service"
            //     },
            //     {
            //         title: "Customers",
            //         link: "user/coustmer"
            //     }
            // ]
        },
        {
            title: "Service Management",
            link: "serviceMangement",
            subMenu: [
                {
                    title: "View Services",
                    link: "serviceMangement"
                },
                // {
                //     title: "Approve/Reject Services",
                //     link: "serviceMangement/manageService"
                // },
                {
                    title: "Manage Categories",
                    link: "serviceMangement/manageCategory"
                }
            ]
        },
        {
            title: "Reports",
            link: "reports"
        },
        {
            title: "Booking Statistics",
            link: "bookingStatistics"
        },
        // {
        //     title: "Settings",
        //     subMenu: [
        //         {
        //             title: "Site Settings",
        //             link: "#site-settings"
        //         },
        //         {
        //             title: "Manage Notifications",
        //             link: "#notifications"
        //         },
        //         {
        //             title: "API Integrations",
        //             link: "#api-integrations"
        //         }
        //     ]
        // },
        // {
        //     title: "Support & Help",
        //     subMenu: [
        //         {
        //             title: "Customer Support Tickets",
        //             link: "#support-tickets"
        //         },
        //         {
        //             title: "FAQs",
        //             link: "#faqs"
        //         },
        //         {
        //             title: "Help Documentation",
        //             link: "#help-docs"
        //         }
        //     ]
        // },
        {
            title: "Admin",
            link: "adminManagement",
            subMenu: [
                {
                    title: "Profile",
                    link: "adminManagement"
                },
                {
                    title: "Change Password",
                    link: "adminManagement/changePassword"
                },
                {
                    title: "Manage Admin",
                    link: "adminManagement/manageAdmin"
                }
            ]
        }
    ];

    const handleMenuClick = (e, index) => {
        if (subMenu && subMenu.length > 0 && subMenu[0] === index) {
            setSubMenu([])
            return
        }
        if (!sidePanelMenu[index].subMenu) {
            return
        }
        setSubMenu([index, ...sidePanelMenu[index].subMenu])
        console.log("clicked", index)
    }

    const handleLogout = async () => {
        const response = await adminAPI.logout()

        if (response.statusCode === 200) {
            dispatch(adminLogout())
            navigate("/admin-login")
        }
    }

    return (
        <div className='w-[20vw] h-[95vh] px-5 py-10  border-r  border-slate-400 bg-[#000]  text-white'>
            {sidePanelMenu.map((menu, index) => (
                <div key={index} className=' rounded-xl flex flex-col p-2'>
                    <div className='cursor-pointer group'>
                        <div onClick={(e) => handleMenuClick(e, index)} className=' group-hover:scale-105 font-medium group-hover:bg-[#185AFF] px-4 py-2 gap-5 rounded-md group-hover:text-white transition-scale duration-100 flex justify-between items-center'>
                            <Link to={menu.link} className='group-hover:text-white text-slate-400 '>{menu.title}</Link>
                            {menu.subMenu && menu.subMenu.length > 0 && <span className='group-hover:text-white text-red-500'><FaAngleDown size={20} /></span>}
                        </div>
                        <div className='ml-4 flex flex-col gap-2  mt-2 transition-all duration-200 h-full border-gray-300 pl-4'>
                            {subMenu && subMenu[0] === index && subMenu.length > 0 && subMenu.map((subMenu, subIndex) => (
                                <>
                                    {subMenu.title &&
                                        <div key={subIndex} className='flex py-1 px-5'>
                                            <Link to={subMenu.link} className='mb-2 hover:text-[#185AFF] text-slate-300   hover:font-bold font-medium'>{subMenu.title && subMenu.title}</Link>
                                        </div>
                                    }
                                </>
                            ))}

                        </div>
                    </div>
                </div>
            ))}
            <button onClick={handleLogout} className='hover:scale-105 w-full  text-red-400  font-medium hover:bg-[#185AFF] px-6 py-2 gap-5 rounded-md hover:text-white transition-scale duration-100 flex justify-between items-center'>Logout</button>
        </div>
    )
}

export default AdminSidePannel