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
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null) // rename to focusedElement?
  const [selectModeActive, setSelectModeActive] = useState(false)

  // Function to enable element selection mode
  const selectElementMode = () => {
    setSelectModeActive(true)

    const cleanupHover = smartHover(
      (hoveredElement: HTMLElement) => {
        console.log('hoveredElement', hoveredElement)
        setSelectedElement(hoveredElement)
        applyBorders(hoveredElement, depth, bordersEnabled)
      },
      (clickedElement: HTMLElement) => {
        console.log('clickedElement', clickedElement)
        setSelectedElement(clickedElement)
        applyBorders(clickedElement, depth, bordersEnabled)

        if (cleanupHover) cleanupHover()
        setSelectModeActive(false)
      },
    )
  }

  // Apply or remove borders whenever bordersEnabled or depth changes
  React.useEffect(() => {
    if (selectedElement) {
      applyBorders(selectedElement, depth, bordersEnabled)
    }
  }, [bordersEnabled, depth, selectedElement])

  return (
    <BorderDebuggerContext.Provider
      value={{
        bordersEnabled,
        setBordersEnabled,
        depth,
        setDepth,
        selectElementMode,
        selectedElement,
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
