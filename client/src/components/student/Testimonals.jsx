import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const Testimonals = () => {
  return (
    <div className="pb-14 px-8 md:px-0">
      <h2 className="text-3xl font-semibold text-gray-800">Testimonials</h2>
      <p className="md:text-base text-gray-300mt-3">Hear from our learners as they share their journeys of transformation,success,and how our <br/> platform has amde a difference in their lives</p>
    <div className="grid grid-cols-auto-fit gap-8 mt-14">
     {dummyTestimonial.map((testimonal ,index)=>(
        <div key={index} className="text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-500/10">
                <img  src={testimonal.image} alt={testimonal.name} className="w-12 h-12 rounded-full object-cover"/>
           <div>
          <h1 className="font-semibold text-gray-800">{testimonal.name}</h1>
          <p className="text-gray-800/80">{testimonal.role}</p>
          </div>
          </div>
     
                
    
                 <div className=" p-5 pb-7">
            <div className="flex gap-0.5">
                {
                    [...Array(5)].map((_,i)=>(
                    <img key={i}src={i < Math.floor(testimonal.rating)? assets.star : assets.star_blank} alt="" className="w-3.5 h-3.5"/>))
                }
            </div>
            <p className="mt-3 text-gray-500">{testimonal.feedback}</p>
          </div>
         </div>
     ))}
    </div>
    </div>
 
  )
}

export default Testimonals;
