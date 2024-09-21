import React, { ReactNode } from 'react'
import { RuioContextProvider } from '@root/context/RuioContextProvider'
import ControlPanel from './RuioUIContainer'

// Single point of entry to ease the process of handling context throughout the module
const RuioWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RuioContextProvider>
      <ControlPanel />
      {children}
    </RuioContextProvider>
  )
}

export default RuioWrapper
