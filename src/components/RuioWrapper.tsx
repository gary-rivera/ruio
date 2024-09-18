import React, { ReactNode } from 'react'
import UtilityIcon from './UtilityIcon'
import { RuioContextProvider } from '@context/RuioContextProvider'
import ControlPanel from './ControlPanel'
import RuioLogo from '../assets/RuioLogo'

const RuioWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RuioContextProvider>
      {/* <RuioLogo /> */}
      <UtilityIcon />
      {/* <ControlPanel /> */}
      {children}
    </RuioContextProvider>
  )
}

export default RuioWrapper
