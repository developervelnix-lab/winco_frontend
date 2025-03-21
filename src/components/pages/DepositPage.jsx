import React from 'react'
import Navbar from '../navbar/Navbar'
import Deposit from '../navbar/Deposit'


function DepositPage() {
  return (
    <>
      <Navbar/>
      <div className='mt-[112px]'>
          <Deposit/>
      </div>
    </>
  )
}

export default DepositPage