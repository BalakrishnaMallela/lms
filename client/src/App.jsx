import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import CourseLists from './pages/student/CourseLists'
import MyEnrollments from './pages/student/MyEnrollments'
import MyCourses from './pages/educator/MyCourses'
import Dashboard from './pages/educator/Dashboard'
import CourseDetails from './pages/student/CourseDetails'
import Player from './pages/student/Player'
import AddCourse from './pages/educator/AddCourse'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Loading from './pages/student/Loading'
import Educator from './pages/educator/Educator'
import NavBar from './components/student/NavBar'
import ErrorPage from './pages/educator/ErrorPage'
import "quill/dist/quill.snow.css";


function App() {
  const [count, setCount] = useState(0)
    const isEducatorPage = useMatch('/educator/*');

  return (
  
    
     <div className='text-default min-h-screen bg-white'>
      {!isEducatorPage && <NavBar />}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/course-list' element={<CourseLists/>} />
        <Route path='/course-list/:input' element={<CourseLists/>} />
         <Route path='/course/:id' element={<CourseDetails/>} />
         <Route path='/my-enrollments' element={<MyEnrollments/>} />
         <Route path='/player/:courseId' element={< Player/>} />
         <Route path="/loading/:path" element={<Loading />} />
         <Route path="/educator" element={<Educator />} >
         <Route path="/educator" element={<Dashboard />} />
          <Route path="my-courses" element={<MyCourses />} />
        <Route path="add-course" element={<AddCourse />} />
   
       <Route path="student-enrolled" element={<StudentsEnrolled />} /> 

         </Route>

        
       
      </Routes>

     </div>
  
  )
}

export default App
