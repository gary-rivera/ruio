import { ReactNode, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { RuioContextProvider } from '@root/context/RuioContextProvider'
import UIContainer from '@components/UIContainer'
import '@root/styles/variables.css'

type RuioWrapperProps = {
  /**
   * catch all for end user to pass
   */
  children: ReactNode
  /**
   * Optional override to show ruio UI in production environments.
   * Set to true to enable in production (useful for demo apps).
   */
  showInProduction?: boolean
  /**
   * Optional CSS selector for the root element to visualize.
   * If not provided, ruio will auto-detect common patterns (#root, #app, etc).
   * Examples: '#root', '#app', '.main-container', '[data-app-root]'
   */
  defaultRootSelector?: string
}

// where it all comes together - primary entry point of ruio
const RuioWrapper = ({ children, showInProduction = false, defaultRootSelector }: RuioWrapperProps) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null)

  // Determine if ruio UI should be shown based on environment
  const inDevelopment = process.env.NODE_ENV !== 'production'
  const shouldShowUI = inDevelopment || showInProduction

  useEffect(() => {
    if (!shouldShowUI) return

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
  }, [shouldShowUI])

  return (
    <RuioContextProvider defaultRootSelector={defaultRootSelector}>
      {shouldShowUI && portalElement && createPortal(<UIContainer />, portalElement)}
      {children}
    </RuioContextProvider>
  )
}

export default RuioWrapper
