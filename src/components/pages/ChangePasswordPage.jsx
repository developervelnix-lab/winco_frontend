import React from 'react'
import Navbar from '../navbar/Navbar'
import PasswordChangeForm from '../sidebar-components/account-actions/ChangePassword'
import { useColors } from '../../hooks/useColors';
function ChangePasswordPage() {
  const COLORS = useColors();
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      <Navbar />
      <div className='pb-10 px-2'>
        <PasswordChangeForm />
      </div>
    </div>
  )
}

export default ChangePasswordPage
