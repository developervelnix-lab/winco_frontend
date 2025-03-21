import React from 'react'
import Navbar from '../navbar/Navbar'
import GiftCardRedemption from '../sidebar-components/Miscellaneous/GiftCard'

function GifrCardPage() {
  return (
   <>
     <Navbar />
     <div className='mt-[112px]'>
         <GiftCardRedemption/>
     </div>
   
   </>
  )
}

export default GifrCardPage