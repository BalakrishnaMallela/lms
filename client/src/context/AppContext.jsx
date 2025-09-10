import { createContext, useState,useEffect } from "react";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";
import { useNavigate } from "react-router-dom";


export const AppContext = createContext();

export const AppProvider = ( props ) => {
    

    const currency  = import.meta.env.VITE_CURRENCY
    const [allCourses,setAllCourses] = useState([]);
    const [isEducator , setIsEducator] = useState(true);
    const navigate = useNavigate();
   

 
  
  const fetchAllCourses = async()=>{
        setAllCourses(dummyCourses)
    }
 



// function for display rating
const calculateRatings = (course) =>{
    if(course.courseRatings.length === 0) return 0;
    let totalRatings = 0;
    course.courseRatings.forEach(rating => {
      totalRatings += rating .rating;
    }); 
    return totalRatings / course.courseRatings.length
}


// function to Calculate Course Chapter Time
  const calculateChapterTime = (chapter) =>{
    let time = 0;
    chapter.chapterContent.map((lecture)=> time += lecture.lectureDuration)
    return humanizeDuration(time*60*1000,{units:["h","m"]});s
  }


// function to Calculate Course Duration
const calculateCourseDuration = (course) =>{
  let time  =  0;
  course.courseContent.map((chapter)=>chapter.chapterContent.map(
    (lecture)=>time += lecture.lectureDuration))
    return humanizeDuration(time*60*1000,{units:["h","m"]})
}
 // function to calculate to No of Lectures of the course
  const calculateNoOfLectures = (course) =>{
    let totalLectures = 0;
    course.courseContent.forEach(chapter =>{
      if(Array.isArray(chapter.chapterContent)){
        totalLectures += chapter.chapterContent.length
      }
    });
    return totalLectures;
  }


  useEffect(()=>{

      fetchAllCourses()
   },[]) 

  const value = {
    // Add any shared state or functions here
    currency,allCourses ,calculateRatings,isEducator,setIsEducator,calculateNoOfLectures, calculateCourseDuration ,
     calculateChapterTime,navigate
  }
  
    return (    
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}