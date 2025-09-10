import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../../components/student/educator/NavBar';
import Sidebar from '../../components/student/educator/Sidebar';
import Footer from '../../components/student/educator/Footer';

const Educator = () => {
  return (
    <div className="text-default min-h-screen bg-white">
      <NavBar/>
    <div className="flex">
      <Sidebar/>
      <div className="flex-1">  {<Outlet />}</div>
   
      </div>
      <Footer/>
    </div>
  )
}

export default Educator;
