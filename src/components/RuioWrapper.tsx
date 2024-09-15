import React, { ReactNode } from 'react'
import UtilityIcon from './UtilityIcon'
import { RuioProvider } from '@context/RuioContext'
import ControlPanel from './ControlPanel'

const RuioWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RuioProvider>
      <UtilityIcon />
      <ControlPanel />
      {children}
    </RuioProvider>
  )
}

export default RuioWrapper
