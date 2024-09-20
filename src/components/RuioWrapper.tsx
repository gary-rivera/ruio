import React, { ReactNode } from 'react'
import { RuioContextProvider } from '@root/context/RuioContextProvider'
import ControlPanel from './ControlPanel'

// Single point of entry to ease the process of handling context throughout the module
const RuioWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RuioContextProvider>
      {/* <RuioLogo /> */}
      {/* <UtilityIcon /> */}
      <ControlPanel />
      {children}
    </RuioContextProvider>
  )
}

export default RuioWrapper
