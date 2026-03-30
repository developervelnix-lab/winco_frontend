import React from 'react'
import Navbar from '../navbar/Navbar'
import OpenBets from '../sidebar-components/statements/OpenBets'

function OpenBetPage() {
  return (
     <>
        <Navbar/>
        <div className=''>
            <OpenBets/>
        </div>
     </>
  )
}

export default OpenBetPage