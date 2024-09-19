import React, { ReactNode, useEffect } from 'react'
import UtilityIcon from './UtilityIcon'
import { RuioContextProvider, useRuioContext } from '@context/RuioContextProvider'
import ControlPanel from './ControlPanel'
import { applyBorders } from '../utils/applyBorders'
import RuioLogo from './RuioToggle'

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
