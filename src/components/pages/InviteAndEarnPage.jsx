import React from 'react'
import Navbar from '../navbar/Navbar'
import InviteAndEarn from '../sidebar-components/Miscellaneous/InviteAndEarn'

function InviteAndEarnPage() {
  return (
    <>
       <Navbar/>
       <div className='mt-[150px] mx-7'>
          <InviteAndEarn/>
       </div>
    </>
  )
}

export default InviteAndEarnPage