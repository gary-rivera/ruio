import React, { ReactNode, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { RuioContextProvider } from '@root/context/RuioContextProvider'
import RuioUIContainer from './RuioUIContainer'

// Single point of entry to ease the process of handling context throughout the module
const RuioWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const existingPortalRoot = document.getElementById('ruio-portal-root')
    const portalRoot = existingPortalRoot || document.createElement('div')

    if (!existingPortalRoot) {
      portalRoot.id = 'ruio-portal-root'
      document.body.appendChild(portalRoot)
    }

    setPortalElement(portalRoot)

    return () => {
      if (!existingPortalRoot && portalRoot.parentNode) {
        portalRoot.parentNode.removeChild(portalRoot)
      }
    }
  }, [])

  return (
    <RuioContextProvider>
      {portalElement && createPortal(<RuioUIContainer />, portalElement)}
      {children}
    </RuioContextProvider>
  )
}

export default RuioWrapper
