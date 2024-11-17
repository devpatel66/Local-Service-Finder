import { useEffect, useState } from 'react'
import { RxCross1 } from "react-icons/rx";
function ToastMessage({ msg, type = "default", heigth = "60px" }) {
    const [currentHeight, setHeigth] = useState("0px")
    const [isVisible, setIsVisible] = useState(true)
    const [progress, setProgress] = useState(100)
    const toastType = {
        "error": ["bg-red-600 text-red-100", "bg-red-200"],
        "success": ["bg-green-600 text-green-100", "bg-green-200"],
        "warning": ["bg-yellow-600 text-yellow-100", "bg-yellow-200"],
        "info": ["bg-blue-600 text-blue-100", "bg-blue-200"],
        "default": ["bg-gray-600 text-gray-100", "bg-gray-200"]
    }
    useEffect(() => {
        setTimeout(() => {
            setHeigth(heigth)
        }, 10)

        const progressInterval = setInterval(() => {
            setProgress(state => state - 1)
        }, 50)

        const hideTimeOut = setTimeout(() => {
            setIsVisible(false)
        }, 5050)

        return () => {
            clearInterval(progressInterval)
            clearTimeout(hideTimeOut)
        }
    }, [heigth,msg])


    if (!isVisible) return null
    return (

        <> 
        <div
            className={`fixed top-5 right-5 ${toastType[type.toLowerCase()][0]} w-80 transition-all duration-500 px-4 py-3 flex justify-between z-50 items-center rounded-lg shadow-lg`}
            style={{ height: currentHeight, overflow: 'hidden' }}>
            <p className={`flex-1 text-sm font-semibold ${toastType[type.toLowerCase()][0]}`}>
                {msg}
            </p>
            {/* <button onClick={() => setIsVisible(false)} className={`ml-3 text-red-100 hover:text-white`}>
                <RxCross1 size={20} />
            </button> */}
            <div
                className={`h-1 absolute bottom-0 left-0 transition-all ${toastType[type.toLowerCase()][1]} rounded-full`}
                style={{ width: `${progress}%` }}></div>
        </div>
        </>

    )
}

export default ToastMessage