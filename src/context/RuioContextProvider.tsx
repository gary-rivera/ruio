import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react'
import { applyBorders } from '../utils/applyBorders'
import { ElementInteractionController } from '../controllers/ElementInteractionController'

interface RuioContextProps {
  bordersEnabled: boolean
  setBordersEnabled: React.Dispatch<React.SetStateAction<boolean>>
  depth: number
  setDepth: React.Dispatch<React.SetStateAction<number>>
  selectElementMode: () => void
  selectedElement: HTMLElement | null
}

const RuioContext = createContext<RuioContextProps | undefined>(undefined)

/**
 * Provides Ruio functionality to its children, including element selection,
 * border application, and interaction management.
 *
 * @param {object} props - The properties for the provider component.
 * @param {ReactNode} props.children - The child components to be rendered inside the provider.
 * @returns {JSX.Element} The context provider component.
 */
export const RuioContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bordersEnabled, setBordersEnabled] = useState(false)
  const [depth, setDepth] = useState(1)
  const [interactedElement, setInteractedElement] = useState<HTMLElement | null>(null)
  const [interactiveModeActive, setInteractiveModeActive] = useState(false)

  /**
   * Activates the element selection mode and sets up hover and click interactions.
   *
   * @returns {function(): void} A cleanup function to remove event listeners when interaction mode is disabled.
   */
  const selectElementMode = () => {
    setInteractiveModeActive(true)

    const cleanupElementSelectionEvents = ElementInteractionController((element: HTMLElement) => {
      setInteractedElement(element)
      applyBorders(element, depth, bordersEnabled)
    })

    return cleanupElementSelectionEvents
  }

  // Apply or remove borders whenever bordersEnabled or depth changes
  useEffect(() => {
    if (interactedElement) {
      applyBorders(interactedElement, depth, bordersEnabled)
    }
  }, [bordersEnabled, depth, interactedElement])

  // Listen for element selection mode cleanup
  useEffect(() => {
    if (!interactiveModeActive && interactedElement) {
      const cleanup = selectElementMode()

      // Cleanup event listeners when selection mode is turned off
      return () => {
        setInteractiveModeActive(false)
        if (cleanup) {
          console.log('Cleaning up interaction controller')
          cleanup()
        }
      }
    }
  }, [interactiveModeActive, interactedElement])

  return (
    <RuioContext.Provider
      value={{
        bordersEnabled,
        setBordersEnabled,
        depth,
        setDepth,
        selectElementMode,
        selectedElement: interactedElement,
      }}
    >
      {children}
    </RuioContext.Provider>
  )
}

/**
 * Custom hook to access the Ruio context.
 *
 * @throws Will throw an error if used outside of the `RuioProvider`.
 * @returns {RuioContextProps} The Ruio context value.
 */
export const useRuioContext = () => {
  const context = useContext(RuioContext)
  if (!context) {
    throw new Error('[RuioContextProvider] useRuio must be used within RuioProvider')
  }
  return context
}
