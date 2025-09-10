import React, { use, useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom' 
import {useClerk , UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'

const NavBar = () => {
    const isCourseListPage   = window.location.pathname.includes('/course-list') 
    const {openSignIn} = useClerk();
    const {user} = useUser();
     const navigate = useNavigate();
     const {isEducator,setIsEducator} = useContext(AppContext)
  return (
    <div className={`flex justify-between items-center px-5 md:px-10 lg:px-20 py-4 shadow-md ${isCourseListPage ? 'bg-white' : 'bg-gray-100'}`}>
    <img onClick={()=> navigate('/')} src={assets.logo} alt="logo" className='W-28 lg:w-32 cursor-pointer'/> 
    <div className=' md:flex flex items-center gap-5 text-gray-500 font-semibold'>
    <div className='flex items-center gap-5 '>

        { user &&
        <>
        <button onClick={()=>navigate("/educator")}>{isEducator ? 'Educator DashBoard': "Become Educator"}</button>
         <Link to="/my-enrollments">My Enrollments</Link> 
         </> 
        } 
    </div>
    {user ?
     <UserButton/> : <button onClick={()=>openSignIn()} className='bg-blue-600 text-white px-4 py-2 rounded-lg'>Create Account</button>}
    </div>

   {/* Mobile NavBar */}
    <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
          <div className='flex items-center gap-5 '>

        { user &&
        <>
          <button onClick={()=>{navigate("/educator")}}>{isEducator ? 'Educator DashBoard': "Become Educator"}</button>
         <Link to="/my-enrollments">My Enrollments</Link> 
         </> 
        } 
    </div>
    {
     user ? <UserButton/> : <button onClick={()=>openSignIn()} ><img src={assets.user_icon}/></button>
    }
            
         
    </div>
    </div>
  )
}

export default NavBar
