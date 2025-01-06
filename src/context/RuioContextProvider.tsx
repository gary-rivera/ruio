import React, { createContext, useState, useEffect, ReactNode, useContext, useRef, useMemo } from 'react'
import { applyOutlineUI } from '../utils/applyOutlineUI'
import { ElementInteractionController } from '../controllers/ElementInteractionController'
import { debounce } from '@utils/debounce'
import { getRootSelectorLocalStorageValue, getRuioEnabledLocalStorageValue } from '@utils/config'
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

export const RuioContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ruioEnabled, setRuioEnabled] = useState(false)
  const [depth, setDepth] = useState(UI_DEPTH)
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null)
  const [isElementSelectionModeActive, setIsElementSelectionModeActive] = useState(false)
  const [currentColorPalette, setCurrentColorPalette] = useState<string>(COLOR_PALETTE)
  const [styleProp, setStyleProp] = useState<string>('outline')

  // persist ruioEnabled & rootElement state across refreshes
  useEffect(() => {
    setRuioEnabled(getRuioEnabledLocalStorageValue())

    const selector = getRootSelectorLocalStorageValue()
    setRootElement(document.querySelector(selector) as HTMLElement)
  }, [])

  // TODO: set these values from local storage via an object that has the keys for each value
  // check if localStorage has a value for depth and set it if it does
  // check if localStorage has a value for currentColorPalette and set it if it does

  useEffect(() => {
    if (ruioEnabled && isElementSelectionModeActive) {
      const debouncedApplyOutline = debounce((element: HTMLElement) => {
        applyOutlineUI({ element, depth, currentColorPalette })
      }, 50)

      const debouncedSetSelection = debounce((element: HTMLElement) => {
        setIsElementSelectionModeActive(false)
        setRootElement(element)
      }, 50)

      const cleanupElementSelectionEvents = ElementInteractionController(
        debouncedApplyOutline,
        debouncedSetSelection,
      )

      return () => {
        if (cleanupElementSelectionEvents) {
          cleanupElementSelectionEvents()
        }
      }
    }
  }, [isElementSelectionModeActive, depth, ruioEnabled])

  // TODO: move this to its own context provider (ElementSelectContextProvider)
  useEffect(() => {
    if (rootElement) {
      applyOutlineUI({
        element: rootElement,
        depth,
        currentColorPalette,
        styleProp,
      })
    }
  }, [depth, rootElement, ruioEnabled, currentColorPalette])

  /**
   * Triggers element selection mode by toggling the active state.
   */
  const toggleElementSelectionMode = () => {
    setIsElementSelectionModeActive((prev) => !prev)
  }

  const contextValue = useMemo(
    () => ({
      ruioEnabled,
      setRuioEnabled,
      depth,
      setDepth,
      rootElement,
      isElementSelectionModeActive,
      setIsElementSelectionModeActive,
      toggleElementSelectionMode,
      currentColorPalette,
      setCurrentColorPalette,
    }),
    [
      ruioEnabled,
      depth,
      rootElement,
      isElementSelectionModeActive,
      toggleElementSelectionMode,
      currentColorPalette,
      setCurrentColorPalette,
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
