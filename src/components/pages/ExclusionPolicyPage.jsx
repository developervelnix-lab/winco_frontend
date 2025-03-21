
import React from 'react'
import ExclusionPolicy from '../sidebar-components/legal-complience/Exclusion'
import Navbar from '../navbar/Navbar'

function ExclusionPolicyPage() {
  return (
     <>
       <Navbar/>
       <div className='mt-[112px]'>
          <ExclusionPolicy/>
       </div>
     
     </>
  )
}

export default ExclusionPolicyPage