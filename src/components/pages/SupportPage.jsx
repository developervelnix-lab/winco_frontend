import React, { useState } from 'react'
import ContactUs from '../sidebar-components/contact/ContactUs'
import SupportHistory from '../sidebar-components/contact/SupportHistory'
import Navbar from '../navbar/Navbar'
import { useColors } from '../../hooks/useColors';

function SupportPage() {
  const COLORS = useColors();
  const [view, setView] = useState('contact'); // 'contact' or 'history'

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      <Navbar />
      <div className='pb-10 px-2'>
        {view === 'contact' ? (
          <ContactUs onShowHistory={() => setView('history')} />
        ) : (
          <SupportHistory onBack={() => setView('contact')} />
        )}
      </div>
    </div>
  )
}

export default SupportPage
