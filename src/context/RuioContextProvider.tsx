import React, { createContext, useState, useEffect, ReactNode, ReactElement, useContext, useMemo, useCallback } from 'react'
import { applyOutlineUI } from '@utils/applyOutlineUI'
import { useLocalStorageState } from '@hooks/useLocalStorageState'
import { useElementSelection } from '@hooks/useElementSelection'
import { UI_DEPTH, COLOR_PALETTE } from '@constants/index'

interface RuioContextProps {
  ruioEnabled: boolean // are ruio related state +/- interactions enabled
  setRuioEnabled: React.Dispatch<React.SetStateAction<boolean>> // dispatcher for ruio

  depth: number // depth of the amount of elements to apply outline UI to
  setDepth: React.Dispatch<React.SetStateAction<number>>

  rootElement: HTMLElement | null // the root element that is selected (defaults to div.body#root)

  isElementSelectionModeActive: boolean // is element selection mode active -- aka are there hover and click events drilled into the DOM
  setIsElementSelectionModeActive: React.Dispatch<React.SetStateAction<boolean>> // toggle element selection mode
  toggleElementSelectionMode: () => void // cb to toggle element selection mode (for clarity, might remove)

  currentColorPalette: string // the key of the current color palette aka theme
  setCurrentColorPalette: React.Dispatch<React.SetStateAction<string>> // setter for the color palette theme
}

const RuioContext = createContext<RuioContextProps | undefined>(undefined)

type RuioContextProviderProps = {
  children: ReactNode
}

export const RuioContextProvider = ({ children }: RuioContextProviderProps): ReactElement => {
  // Custom hooks for separated concerns
  const localStorage = useLocalStorageState()
  const [depth, setDepth] = useState(UI_DEPTH)
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null)
  const [currentColorPalette, setCurrentColorPalette] = useState<string>(COLOR_PALETTE)

  // Initialize rootElement from localStorage selector
  useEffect(() => {
    if (localStorage.rootSelector) {
      const element = document.querySelector(localStorage.rootSelector) as HTMLElement
      if (element) {
        setRootElement(element)
      }
    }
  }, [localStorage.rootSelector])

  // Callback for when an element is selected in selection mode
  const handleElementSelected = useCallback((element: HTMLElement) => {
    setRootElement(element)
  }, [])

  // Element selection mode hook
  const elementSelection = useElementSelection({
    ruioEnabled: localStorage.ruioEnabled,
    depth,
    currentColorPalette,
    onElementSelected: handleElementSelected,
  })

  // Apply outline UI when settings or root element change
  useEffect(() => {
    if (rootElement) {
      applyOutlineUI(rootElement, depth, localStorage.ruioEnabled, currentColorPalette)
    }
  }, [depth, rootElement, localStorage.ruioEnabled, currentColorPalette])

  const contextValue = useMemo(
    () => ({
      ruioEnabled: localStorage.ruioEnabled,
      setRuioEnabled: localStorage.setRuioEnabled,
      depth,
      setDepth,
      rootElement,
      isElementSelectionModeActive: elementSelection.isActive,
      setIsElementSelectionModeActive: elementSelection.setIsActive,
      toggleElementSelectionMode: elementSelection.toggle,
      currentColorPalette,
      setCurrentColorPalette,
    }),
    [
      localStorage.ruioEnabled,
      localStorage.setRuioEnabled,
      depth,
      rootElement,
      elementSelection.isActive,
      elementSelection.setIsActive,
      elementSelection.toggle,
      currentColorPalette,
    ],
  )

  return <RuioContext.Provider value={contextValue}>{children}</RuioContext.Provider>
}

export const useRuioContext = () => {
  const context = useContext(RuioContext)
  if (!context) {
    throw new Error('[RuioContextProvider] useRuio must be used within RuioProvider')
  }
  return context
}
