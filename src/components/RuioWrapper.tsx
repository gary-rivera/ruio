import React, { ReactNode } from 'react'
import UtilityIcon from './UtilityIcon'
import { RuioContextProvider } from '@context/RuioContextProvider'

const RuioWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RuioContextProvider data-testid="ruio-toggle-icon">
      <UtilityIcon />
      {children}
    </RuioContextProvider>
  )
}

export default RuioWrapper
