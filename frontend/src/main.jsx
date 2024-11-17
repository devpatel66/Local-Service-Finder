import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, Route, createRoutesFromElements } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { Signin, Signup, ServicePage, UserDashboard, ServiceDashbard, AddService, BookingPage, DetailServicePage, Overview, Pricing, PreviewPage, AdminDashBoard, EditServiceDetails,ReportPage } from './components/pages/index.js'
import { OverviewAdmin, UserSection, ServiceMangement, ViewServices, MangeCategory,AdminSection, MangeServices, BookingStatics, ManageAdmin, AdminProfile,Reports,AdminPasswordResetPage } from './components/pages/AdminDashBoard/adminIndex.js'

import UserProfile from './components/pages/UserDashboard/UserProfile.jsx'
import EditUserProfile from './components/pages/UserDashboard/EditUserProfile.jsx'
import PasswordResetPage from './components/pages/UserDashboard/ChangePassword.jsx'
import BookedServicesList from './components/pages/UserDashboard/BookedServicesList.jsx'

import AboutUs from './components/pages/About.jsx'
import Favorite from './components/pages/Favorite.jsx'
import ForgotPasswordPage from './components/pages/ForgotPasswordPage.jsx'
import RestPassword from './components/pages/RestPassword.jsx'


// admin
import AdminLogin from './components/pages/AdminDashBoard/AdminLogin.jsx'

const route = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      {/* Users Routes */}
      <Route path='/' element={<App />}>
        <Route index path='/' element={<ServicePage />} />
        <Route index path='aboutus' element={<AboutUs />} />
        <Route index path='report' element={<ReportPage />} />
        <Route index path='resetPassword/:token/:email/:user' element={<RestPassword />} />
        <Route index path='favorite' element={<Favorite />} />
        <Route index path='forgotPassword/:user' element={<ForgotPasswordPage />} />
        <Route path='signup' element={<Signup />} />
        <Route path='signin' element={<Signin />} />
        <Route path='addService' element={<AddService />}>
          <Route index path='' element={<Overview />} />
          <Route path='addPrice' element={<Pricing />} />
          <Route path='preview' element={<PreviewPage />} />
        </Route>
          <Route path='editService/:id' element={<EditServiceDetails />} />
        <Route path='dashboard' element={<UserDashboard />}>
          <Route index element={<UserProfile />} />
          <Route path='editService/:id' element={<EditServiceDetails />} />
          <Route path='editProfile' element={<EditUserProfile />} />
          <Route path='passwordRest' element={<PasswordResetPage />} />
          <Route path='bookedService' element={<BookedServicesList />} />
        </Route>
        <Route path='detailServicePage/:id' element={<DetailServicePage />} />
        <Route path='booking/:id' element={<BookingPage />} />
        <Route path='serviceDashboard' element={<ServiceDashbard />} />
      </Route>

      {/* Admin Routes */}
      <Route path='/admin' element={<AdminDashBoard />}>
        <Route index element={<OverviewAdmin />} />
        <Route path='overview' element={<OverviewAdmin />} />
        <Route path='user' element={<UserSection />} />
        <Route path='bookingStatistics' element={<BookingStatics />} />
        <Route path='serviceMangement' element={<ServiceMangement />} >
          <Route index element={<ViewServices />} />
          <Route path='detailServicePage/:id/:by' element={<DetailServicePage />} />
          <Route path='editService/:id/:by' element={<EditServiceDetails />} />
          <Route path='manageService' element={<MangeServices />} />
          <Route path='manageCategory' element={<MangeCategory />} />
        </Route>
        <Route path='adminManagement' element={<AdminSection />} >
          <Route index element={<AdminProfile />} />
          <Route path='manageAdmin' element={<ManageAdmin />} />
          <Route path='changePassword' element={<AdminPasswordResetPage />} />
        </Route>
          <Route path='reports' element={<Reports />} />
      </Route>

      <Route path='/admin-login' element={<AdminLogin />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  </React.StrictMode>,
)
