import React from 'react'
import ResponsibleGambling from '../sidebar-components/legal-complience/ResponsibleGambling'
import Navbar from '../navbar/Navbar'

function ResponsibleGamblingPage() {
  return (
   <>
      <Navbar/>
      <div className='mt-[112px]'>
          <ResponsibleGambling/>
      </div>
   </>
  )
}

export default ResponsibleGamblingPage