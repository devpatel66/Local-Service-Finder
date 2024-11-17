import { useState, useEffect } from "react";
import { serviceApi } from '../../../api/serviceAPI'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Pencil, Trash2, Plus } from 'lucide-react';
import Popup from "../../utils/Popup";
import {Input} from '../../index'
function ServiceCard() {

  const userData = useSelector(state => state.authReducer.userData)
  const authStatus = useSelector(state => state.authReducer.authStatus)
  const navigate = useNavigate()
  const [services, setServices] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [deleteError,setDeleteError] = useState(null);
  const [deleteServiceId,setDeleteServiceId] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-500 text-white px-2 py-1 rounded-full">Active</span>;
      case 'pending':
        return <span className="bg-yellow-500 text-white px-2 py-1 rounded-full">Pending</span>;
      default:
        return <span className="bg-gray-500 text-white px-2 py-1 rounded-full">Unknown</span>;
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceApi.getServiceByUserId(userData.user_id);
        // console.log(response);

        if (response.statusCode == 200) {
          // console.log(response.data);

          setServices(response.data);
        }

      } catch (error) {
        console.error(error);
      }
    };

    if (!services && authStatus) {
      fetchServices();
    }

  }, [authStatus]);

  const handleDeleteService = async () => {


    if(confirmMsg !== "I am seriously sure"){
      setDeleteError("Please type I am seriously sure");
      return;
    }
      const response = await serviceApi.deleteService({service_id:deleteServiceId,confirmMsg});
      if (response.statusCode == 200) {
        setDeletePopup(false);
        window.location.reload();
        setDeleteServiceId(null);
      }
      else{
        setDeleteError(response.msg);
      }
    }
  return (
    <>
    {
      deletePopup && <Popup errMsg={deleteError} btnFunc={handleDeleteService} title="Delete Service" btnText="Delete" msg={"Are you sure you want to delete this service? "}  btnCloseFunc={() => {setDeletePopup(false); setDeleteError(null)}}>
        <p>Type <span className="font-bold">{`"I am seriously sure"`}</span></p>
        <Input onChange={(e) => setConfirmMsg(e.target.value)}  type="text" placeholder="I am seriously sure" name="" id="" />
      </Popup>
    }
      <div>
        <div className="bg-white  shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4 sm:mb-0">Existing Services</h2>
            <button onClick={() => navigate("/addService")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Plus color="white" className="h-5 w-5 mr-2" />
              Add Service
            </button>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {Array.isArray(services) && services.length ? services?.map((service, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                      <p className="text-2xl font-medium text-indigo-600 truncate">{service.title}</p>
                      {/* <p className="mt-1 text-base text-gray-500">Status: {service.status}</p> */}
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => navigate(`/editService/${service.service_id}`)} className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <Pencil className="h-5 w-5" />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button onClick={() => {setDeletePopup(true); setDeleteServiceId(service.service_id)}} className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))
                : <p>No services found</p>
              }
            </ul>
          </div>
        </div>

      </div>
    </>
  )
}

export default ServiceCard