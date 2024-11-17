import React, { useEffect, useRef, useState } from 'react'
import { Input, Button,ToastMessage } from '../../../index'
import Header from './Header';
import { serviceApi } from '../../../../api/serviceAPI';
import Popup from '../../../utils/Popup';
import categoryApi from '../../../../api/categoryAPI';

function MangeCategory() {
  const mainContainer = useRef(null)
  const [subCategory, setSubCategory] = useState({})
  const [categories, setCategories] = useState([])
  const [addNewCategory,setAddNewCategory] = useState(false)
  const [addNewSubCategory,setAddNewSubCategory] = useState(false)
  const [toastMessageSuccess,setToastMessageSuccess] = useState("")

  const categoryDataFetch = async () => {
    try {
      const responseData = await serviceApi.getAllCategoryList()
      console.log(responseData);
      
      if(responseData.statusCode === 200){

        setCategories(responseData.data)
      }
      else{
        setCategories([])
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  useEffect(() => {
    categoryDataFetch()
  },[])
  
  const handleViewBtn = async (e, category_id,category_name) => {
    setSubCategory([])
    e.preventDefault()
    const response = await serviceApi.getSubCategoryList(category_id)

    if(response.statusCode === 200){
      setSubCategory({category_name,data:response.data})
    }
  }



  const handleAddSubCateory = async(e, category_id,category_name)=>{
    setSubCategory([])
    setSubCategory({category_name,category_id})
    setAddNewSubCategory(true)
  }
  
  const [newCategory, setNewCatory] = useState("")
  const [newCategoryError, setNewCatoryError] = useState("")

  const handleAddNewCategory = async (e)=>{
    e.preventDefault()
    setNewCatoryError("")
    if(newCategory === "" || !newCategory){
      setNewCatoryError("New category name is required")
      return
    }

    const response = await categoryApi.addCategory(newCategory)
    if(response.statusCode === 200){
      categoryDataFetch()
      setToastMessageSuccess("Category Added Successfully")
      setAddNewCategory(false)
      setTimeout(()=>{
        setToastMessageSuccess("")
      },5000)
    }
    else{
      setNewCatoryError(response.msg)
    }
  }

  const handleaddNewSubCategory = async (e)=>{
    e.preventDefault()
    setNewCatoryError("")
    if(newCategory === "" || !newCategory){
      setNewCatoryError("Name is required")
      return
    }

    const response = await categoryApi.addSubCategory({name:newCategory,category_id:subCategory.category_id})
    if(response.statusCode === 200){
      categoryDataFetch()
      setToastMessageSuccess("Category Added Successfully")
      setAddNewSubCategory(false)
      setTimeout(()=>{
        setToastMessageSuccess("")
      },5000)
    }
    else{
      setNewCatoryError(response.msg)
    }
  }
  return (
    <>
    {toastMessageSuccess && <ToastMessage msg={toastMessageSuccess} type='success'/>}
    {subCategory && subCategory.data && subCategory.data.length > 0 && <Popup btnText='' btnCloseFunc={()=>setSubCategory({})} title={`${subCategory.category_name} Sub-categories`} msg={`List of sub-categories under ${subCategory.category_name}`}>
      <div className='border p-2 mt-2 rounded-md'>
          
            {
              subCategory && subCategory.data.length > 0 && subCategory.data.map((item,index)=> (
                <li key={index}>{item.name}</li>
              ))
            }
      </div>
      </Popup>
      }

      { addNewCategory &&
        <Popup title='Add New Category' errMsg={newCategoryError} btnCloseFunc={()=>setAddNewCategory(false)} btnFunc={handleAddNewCategory} btnText='Add New'>
          
          <div className='mt-5'>
          <Input onChange={(e)=>setNewCatory(e.target.value)} label="New Category Name" required='true'/>
              
          </div>
        </Popup>
      }
      { addNewSubCategory &&
        <Popup title='Add Sub Category' msg={`Add ${subCategory.category_name}  sub category`} errMsg={newCategoryError} btnCloseFunc={()=>setAddNewSubCategory(false)} btnFunc={handleaddNewSubCategory} btnText='Add New'>
          
          <div className='mt-5'>
          <Input onChange={(e)=>setNewCatory(e.target.value)} label="New Sub Category Name" required='true'/>
              
          </div>
        </Popup>
      }
      <div ref={mainContainer} className='w-full h-full bg-slate-200 gap-5 flex p-5 flex-col'>

        <p className='text-5xl font-bold px-5'>Service Management</p>

        <div className='w-full flex flex-col p-10 gap-10 bg-white rounded-3xl'>
          <div className='w-full flex justify-between'>
            <p className='text-4xl'>Manage Category</p>
            <Button onClick={()=>{setAddNewCategory(true); setNewCatoryError("")}} textColor='text-white' className='border w-max text-lg py-2 bg-[#185AFF] hover:bg-[#6B17FF]'>Add New Category</Button>
          </div>


          <table className="w-full text-2xl text-center border-b">
            <thead>
              <tr className="border-b">
                <th className="">Sr. No.</th>
                <th className="">Category Name</th>
                <th className="">Total Sub-Category</th>
                <th className="">Actions</th>
              </tr>
            </thead>
            <tbody className='mt-5'>
              {categories && categories.length > 0 && categories.map((category, index) => (
                <React.Fragment key={index}>
                  <tr className="border-b py-10">
                    <td className="py-4 text-lg ">{index + 1}</td>
                    <td className="py-4 text-lg text-wrap w-1/6">{category.name}</td>
                    <td className="py-4 text-lg ">{category._count.SubCategory}</td>
                    <td className="py-4 text-lg flex justify-evenly gap-2">
                      <Button onClick={(e) => handleViewBtn(e, category.category_id,category.name)} textColor="text-white" className="border w-1/3 text-lg py-2 bg-blue-500">View Sub Category</Button>
                      <Button onClick={(e) => handleAddSubCateory(e, category.category_id,category.name)} textColor="text-white" className="border w-1/3 text-lg py-2 bg-blue-500">Add New SubCategory</Button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>


          <div className='w-full gap-2 flex justify-center items-center'>
            <p>Next</p>
            <p>Previous</p>
          </div>
        </div>
        {/* End Second Section User List */}



      </div>
    </>
  )
}

export default MangeCategory