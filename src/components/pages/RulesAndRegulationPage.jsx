import React from 'react'
import RulesAndRegulation from '../sidebar-components/legal-complience/RulesAndRegulation'
import Navbar from '../navbar/Navbar'

function RulesAndRegulationPage() {
    return (

        <>
            <Navbar />
            <div className='mt-[112px]'>
                <RulesAndRegulation />
            </div>
        </>
    )
}

export default RulesAndRegulationPage