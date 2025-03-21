import React from 'react'
import Navbar from '../navbar/Navbar'
import BettingTransactionPage from '../sidebar-components/statements/BettingTransaction'

function ProfitLossPage() {
  return (
    <>
      <Navbar/>
      <div className='pt-[115px]'>
        <BettingTransactionPage/>
      </div>
    </>
  )
}

export default ProfitLossPage