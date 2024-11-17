import React, { useEffect, useState } from 'react'
import reportApi from '../../api/reportAPI'
import { ToastMessage } from '../index'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

export default function Component() {
  const navigate = useNavigate()
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const authStatus = useSelector(state => state.authReducer.authStatus)

  const [descriptionError, setDescriptionError] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (description.length === 0) {
      setDescriptionError('Description is required')
    }

    if (category.length === 0 || category === "") {
      setCategoryError('Category is required')
    }

    if (!description || !category) {
      return
    }

    const response = await reportApi.createReport({ description, category })

    if (response.statusCode === 200) {
      setSuccess(response.msg)
      setDescription('')
      setCategory('')
      setTimeout(() => {
        setSuccess(null)
      }, 4500)
    }
    else {
      setError(response.msg)
      setTimeout(() => {
        setError(null)
      }, 4500)
    }
  }

  useEffect(() => {
    if (!authStatus) {
      navigate('/signin')
    }
  }, [authStatus])

  return (
    <>
      {
        error && <ToastMessage type="error" msg={error} />
      }
      {
        success && <ToastMessage type="success" msg={success} />
      }
      <div className="  py-12 px-4 w-[50vw] sm:px-6 lg:px-8">
        <div className=" mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit a Report</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="4"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe the issue or feedback in detail"
                ></textarea>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  <option value="technical">Technical Issue</option>
                  <option value="feedback">General Feedback</option>
                  <option value="service">Related To Service</option>
                  <option value="booking">Related to Booking</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}