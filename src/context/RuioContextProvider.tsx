import React, { createContext, useState, useEffect, ReactNode, useContext, useRef, useMemo } from 'react'
import { applyOutlineUI } from '../utils/applyOutlineUI'
import { ElementInteractionController } from '../controllers/ElementInteractionController'

interface RuioContextProps {
  ruioEnabled: boolean // are ruio related state +/- interactions enabled
  setRuioEnabled: React.Dispatch<React.SetStateAction<boolean>> // toggle ruio related state/interactions
  depth: number // depth of the amount of elements to apply outline UI to
  setDepth: React.Dispatch<React.SetStateAction<number>>
  parentAppRootElement: HTMLElement | null // the root of the parent react application
  setParentAppRootElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  selectedRootElement: HTMLElement | null // the root element that is selected (defaults to div.body#root)
  isElementSelectionModeActive: boolean // is element selection mode active -- aka are there hover and click events drilled into the DOM
  setIsElementSelectionModeActive: React.Dispatch<React.SetStateAction<boolean>> // toggle element selection mode
  toggleElementSelectionMode: () => void // cb to toggle element selection mode (for clarity, might remove)
}

const RuioContext = createContext<RuioContextProps | undefined>(undefined)

export const RuioContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ruioEnabled, setRuioEnabled] = useState(false)
  const [depth, setDepth] = useState(3)
  const [selectedRootElement, setSelectedRootElement] = useState<HTMLElement | null>(null)
  const [isElementSelectionModeActive, setIsElementSelectionModeActive] = useState(false)
  const [parentAppRootElement, setParentAppRootElement] = useState<HTMLElement | null>(
    document.querySelector('#root') as HTMLElement | null,
  )

  // if current element has standard react root class element and the current selected element isn't the root class element, dont apply the ui outlining styles
  const controlPanelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (ruioEnabled && controlPanelRef.current) {
      controlPanelRef.current.style.display = 'block'
    } else if (controlPanelRef.current) {
      controlPanelRef.current.style.display = 'none'
    }
  }, [ruioEnabled])

  // TODO: use this to store the previous selected root element for when a user exits element selection mode without picking an element
  const previousSelectedRootElementRef = useRef<HTMLElement | null>(null)

  /**
   * Triggers element selection mode by toggling the active state.
   * Wrapped in useCallback to maintain referential equality in contextValue.
   */
  const toggleElementSelectionMode = () => {
    setIsElementSelectionModeActive((prev) => !prev)
  }

  useEffect(() => {
    if (ruioEnabled && isElementSelectionModeActive) {
      const cleanupElementSelectionEvents = ElementInteractionController(
        (element) => {
          applyOutlineUI(element, depth, ruioEnabled)
        },
        (element) => {
          setIsElementSelectionModeActive(false)
          setSelectedRootElement(element)
        },
      )

      return () => {
        if (cleanupElementSelectionEvents) {
          cleanupElementSelectionEvents()
        }
      }
    }
  }, [isElementSelectionModeActive, depth, ruioEnabled])

  useEffect(() => {
    if (selectedRootElement) {
      applyOutlineUI(selectedRootElement, depth, ruioEnabled)
    }
  }, [depth, selectedRootElement, setRuioEnabled, ruioEnabled])

  const contextValue = useMemo(
    () => ({
      ruioEnabled,
      setRuioEnabled,
      depth,
      setDepth,
      parentAppRootElement,
      setParentAppRootElement,
      selectedRootElement,
      isElementSelectionModeActive,
      setIsElementSelectionModeActive,
      toggleElementSelectionMode,
    }),
    // TODO: verify -- is it necessary to include all of these deps?
    [
      ruioEnabled,
      depth,
      parentAppRootElement,
      setParentAppRootElement,
      selectedRootElement,
      isElementSelectionModeActive,
      toggleElementSelectionMode,
    ],
  )

  return <RuioContext.Provider value={contextValue}>{children}</RuioContext.Provider>
}

/**
 * Custom hook to access the Ruio context.
 */
export const useRuioContext = () => {
  const context = useContext(RuioContext)
  if (!context) {
    throw new Error('[RuioContextProvider] useRuio must be used within RuioProvider')
  }
  return context
}
