import React from 'react'
import { X, Check, Calendar } from 'lucide-react'


export default function DeatilBookedService({ serviceData, setDetailBookedData }) {

    console.log(serviceData);


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
        return new Date(dateString).toLocaleDateString('en-US', options)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden">
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Service Details</h2>
                    <button onClick={() => setDetailBookedData(null)} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                </div>

                <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900">{serviceData.title}</h3>
                        <p className="text-sm text-gray-500">{`${serviceData.booking_date}`}</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-base sm:text-md font-medium text-gray-700">Customer Details</h4>
                        <p className="text-sm text-gray-600">Customer Name : {serviceData.customer_name}</p>
                        <p className="text-sm text-gray-600">Phone Number :{serviceData.customer_phone}</p>
                        <p className="text-sm text-gray-600 break-words">Email : {serviceData.customer_email}</p>
                        <p className="text-sm text-gray-600">Address : {serviceData.customer_address}</p>
                        <p className="text-sm text-gray-600 font-semibold">Instruction : {serviceData.message}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}