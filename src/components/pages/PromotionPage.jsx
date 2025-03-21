import React from 'react'
import Navbar from '../navbar/Navbar'
import Promotion from '../sidebar-components/Miscellaneous/Promotion'

function PromotionPage() {
  return (
    <>
      <Navbar/>
      <div className='mt-[120px] mx-10'>
         <Promotion/>
      </div>
    
    </>
  )
}

export default PromotionPage