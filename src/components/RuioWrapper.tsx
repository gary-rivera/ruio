import { ReactNode, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { RuioContextProvider } from '@root/context/RuioContextProvider'
import RuioUIContainer from '@components/RuioUIContainer'

type RuioWrapperProps = {
  children: ReactNode
  /**
   * Override to show ruio UI in production environments.
   * By default, ruio only shows in development (NODE_ENV !== 'production').
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

// Single point of entry to ease the process of handling context throughout the module
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
      {shouldShowUI && portalElement && createPortal(<RuioUIContainer />, portalElement)}
      {children}
    </RuioContextProvider>
  )
}

export default RuioWrapper
