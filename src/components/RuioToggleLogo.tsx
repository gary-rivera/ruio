import React from 'react'
import '@styles/RuioToggleLogo.css'
import RuioLogoIcon from '@assets/RuioLogoIcon'

import { useRuioContext } from '../context/RuioContextProvider'

// NOTE: semi redundant, but this is a more specific component for the logo and its management of the toggle state whereas RuioLogoIcon is just the icon itself
function RuioToggleLogo() {
  const { ruioEnabled, setRuioEnabled } = useRuioContext()

  return (
    <div
      className="ruio-exclude ruio-toggle-logo"
      onClick={() => {
        setRuioEnabled(!ruioEnabled)
        console.log('RuioToggleLogo clicked', ruioEnabled)
      }}
    >
      <RuioLogoIcon />
    </div>
  )
}

export default RuioToggleLogo
