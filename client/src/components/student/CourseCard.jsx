import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';

const CourseCard = ({course}) => {
    const {currency,calculateRatings} = useContext(AppContext);
  return (
    <Link to={'/course/'+course._id} className="border border-gray-500/30 rounded-lg pb-6 overflow-hidden cursor-pointer">
       <img className="w-full"src={course.courseThumbnail} alt="thumbnail"/> 
       <div className="p-3 text-left">
       <h1 className='font-semibold text-base'>{course.courseTitle}</h1> 
       <p className="text-gray-500">Katpadi Saicharan</p>
       
    <div className="flex items-center space-x-2">
 
       <p>{calculateRatings(course)}</p>
       <div className="flex">
         {[...Array(5)].map((_,i)=>(<img key={i}src={i < Math.floor(calculateRatings(course))? assets.star : assets.star_blank} alt="" className="w-3.5 h-3.5"/>))}

       </div>
       <p className="text-gray-500">{course.courseRatings.length}</p>
       </div>
         <p className="text-base font-semibold text-gray-800">{currency}{(course.coursePrice - course.discount * course.coursePrice/100).toFixed(2)}</p>
       </div>
        </Link>
  )
}

export default CourseCard
