import React, { createContext, useState, ReactNode, useContext } from 'react'
import { applyBorders } from '../utils/applyBorders'
import { smartHover } from '../utils/smartHover'

interface BorderDebuggerContextProps {
  bordersEnabled: boolean
  setBordersEnabled: React.Dispatch<React.SetStateAction<boolean>>
  depth: number
  setDepth: React.Dispatch<React.SetStateAction<number>>
  selectElementMode: () => void
  selectedElement: HTMLElement | null
}

const BorderDebuggerContext = createContext<BorderDebuggerContextProps | undefined>(undefined)

export const BorderDebuggerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bordersEnabled, setBordersEnabled] = useState(false)
  const [depth, setDepth] = useState(1)
  const [interactedElement, setInteractedElement] = useState<HTMLElement | null>(null)
  const [selectModeActive, setSelectModeActive] = useState(false)

  const selectElementMode = () => {
    setSelectModeActive(true)

    const cleanupHover = smartHover((element: HTMLElement) => {
      setInteractedElement(element)
      applyBorders(element, depth, bordersEnabled)
    })

    return cleanupHover
  }

  // Apply or remove borders whenever bordersEnabled or depth changes
  React.useEffect(() => {
    if (interactedElement) {
      applyBorders(interactedElement, depth, bordersEnabled)
    }
  }, [bordersEnabled, depth, interactedElement])

  // Listen for element selection mode cleanup
  React.useEffect(() => {
    if (!selectModeActive && interactedElement) {
      const cleanup = selectElementMode()

      // Cleanup event listeners when selection mode is turned off
      return () => {
        if (cleanup) cleanup()
        setSelectModeActive(false)
      }
    }
  }, [selectModeActive, interactedElement])

  return (
    <BorderDebuggerContext.Provider
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
    </BorderDebuggerContext.Provider>
  )
}

export const useBorderDebugger = () => {
  const context = useContext(BorderDebuggerContext)
  if (!context) {
    throw new Error('useBorderDebugger must be used within BorderDebuggerProvider')
  }
  return context
}
