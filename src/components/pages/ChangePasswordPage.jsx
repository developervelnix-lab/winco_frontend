import React from 'react'
import Navbar from '../navbar/Navbar'
import PasswordChangeForm from '../sidebar-components/account-actions/ChangePassword'

function ChangePasswordPage() {
  return (
    <>
       <Navbar/>
       <div className='pt-[120px] mx-3'>
         <PasswordChangeForm/>
       </div>
    </>
  )
}

export default ChangePasswordPage