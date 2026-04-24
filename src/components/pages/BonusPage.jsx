import React from 'react'
import Navbar from '../navbar/Navbar'
import Bonus from '../sidebar-components/Miscellaneous/Bonus'
import { useColors } from '../../hooks/useColors';
function BonusPage() {
  const COLORS = useColors();
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      <Navbar />
      <div className='pb-10 px-2'>
        <Bonus />
      </div>
    </div>
  )
}

export default BonusPage
