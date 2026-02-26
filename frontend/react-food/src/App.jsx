import React from 'react'
import './styles/auth.css'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import UserRegister from './pages/UserRegister'
import UserLogin from './pages/UserLogin'
import PartnerRegister from './pages/PartnerRegister'
import PartnerLogin from './pages/PartnerLogin'
import Home from './general/Home'
import CreateFoodPartner from './food-partner/createfoodpartner'
import Profile from './food-partner/Profile'
import Userprofile from './User/Userprofile'
import EditReel from './food-partner/EditReel'


function App() {
  const router = createBrowserRouter([
    { path: '/', element: <Home/> },
    { path: '/user/register', element: <UserRegister /> },
    { path: '/user/login', element: <UserLogin /> },
    { path: '/partner/register', element: <PartnerRegister /> },
    { path: '/partner/login', element: <PartnerLogin /> },
    { path: '/create-food', element: <CreateFoodPartner /> },
    { path: '/partner/:id', element: <Profile /> },
    { path: '/profile', element: <Userprofile/>},
    {path:'/edit/:id',element:<EditReel/>},
  ])

  return <RouterProvider router={router} />
}

export default App