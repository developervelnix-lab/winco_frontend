import React from 'react'
import { useSearchParams } from 'react-router-dom'
import ContactUs from '../sidebar-components/contact/ContactUs'
import SupportHistory from '../sidebar-components/contact/SupportHistory'
import Navbar from '../navbar/Navbar'
import { useColors } from '../../hooks/useColors';

function SupportPage() {
  const COLORS = useColors();
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') || 'contact';

  const setShowHistory = () => {
    setSearchParams({ view: 'history' });
  };

  const setShowContact = () => {
    setSearchParams({}); // Back to default
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      <Navbar />
      <div className='pb-10 px-2'>
        {view === 'history' ? (
          <SupportHistory onBack={setShowContact} />
        ) : (
          <ContactUs onShowHistory={setShowHistory} />
        )}
      </div>
    </div>
  )
}

export default SupportPage
