import React from 'react'
import Navbar from '../navbar/Navbar'
import GiftCardRedemption from '../sidebar-components/Miscellaneous/GiftCard'
import { useColors } from '../../hooks/useColors';
function GifrCardPage() {
  const COLORS = useColors();
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      <Navbar />
      <div className='pb-10 px-2'>
        <GiftCardRedemption />
      </div>
    </div>
  )
}

export default GifrCardPage