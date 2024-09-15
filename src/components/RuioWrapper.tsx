import React, { ReactNode } from 'react'
import UtilityIcon from './UtilityIcon'
import { RuioContextProvider } from '@context/RuioContextProvider'
import ControlPanel from './ControlPanel'

const RuioWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RuioContextProvider>
      <UtilityIcon />
      <ControlPanel />
      {children}
    </RuioContextProvider>
  )
}

export default RuioWrapper
