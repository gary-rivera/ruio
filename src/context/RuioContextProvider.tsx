import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react'
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

export const RuioContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bordersEnabled, setBordersEnabled] = useState(false)
  const [depth, setDepth] = useState(1)
  const [interactedElement, setInteractedElement] = useState<HTMLElement | null>(null)
  const [interactiveModeActive, setInteractiveModeActive] = useState(false)
  const [cleanupElementSelectionEvents, setCleanupElementSelectionEvents] = useState<
    (() => void) | null
  >(null)

  /**
   * Activates the element selection mode and sets up hover and click interactions.
   */
  const selectElementMode = () => {
    setInteractiveModeActive(true)

    const cleanupFn = ElementInteractionController((element: HTMLElement) => {
      setInteractedElement(element)
      applyBorders(element, depth, bordersEnabled)
    })

    // Store the cleanup function so we can call it on unmount
    setCleanupElementSelectionEvents(() => cleanupFn)
  }

  // Apply or remove borders whenever bordersEnabled or depth changes
  useEffect(() => {
    if (interactedElement) {
      applyBorders(interactedElement, depth, bordersEnabled)
    }
  }, [bordersEnabled, depth, interactedElement])

  // Cleanup interaction controller on unmount or when mode deactivates
  useEffect(() => {
    return () => {
      if (cleanupElementSelectionEvents) {
        console.log('Cleaning up interaction controller')
        cleanupElementSelectionEvents()
      }
      setInteractiveModeActive(false)
    }
  }, [cleanupElementSelectionEvents])

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

export const useRuioContext = () => {
  const context = useContext(RuioContext)
  if (!context) {
    throw new Error('[RuioContextProvider] useRuio must be used within RuioProvider')
  }
  return context
}
