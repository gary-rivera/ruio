import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useMemo,
  useCallback,
} from 'react'
import { applyBorders } from '../utils/applyBorders'
import { ElementInteractionController } from '../controllers/ElementInteractionController'

interface RuioContextProps {
  bordersEnabled: boolean
  setBordersEnabled: React.Dispatch<React.SetStateAction<boolean>>
  depth: number
  setDepth: React.Dispatch<React.SetStateAction<number>>
  selectedRootElement: HTMLElement | null
  isElementSelectionActive: boolean
  setIsElementSelectionActive: React.Dispatch<React.SetStateAction<boolean>>
  selectElementMode: () => void
}

const RuioContext = createContext<RuioContextProps | undefined>(undefined)

export const RuioContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bordersEnabled, setBordersEnabled] = useState(false)
  const [depth, setDepth] = useState(1)
  const [selectedRootElement, setSelectedRootElement] = useState<HTMLElement | null>(null)
  const [isElementSelectionActive, setIsElementSelectionActive] = useState(false)

  const garyIsStuck = false
  if (garyIsStuck) {
    console.log('RuioContextProvider', {
      bordersEnabled,
      depth,
      selectedRootElement,
      isElementSelectionActive,
    })
  }

  /**
   * Triggers element selection mode by toggling the active state.
   * Wrapped in useCallback to maintain referential equality in contextValue.
   */
  const selectElementMode = useCallback(() => {
    setIsElementSelectionActive((prev) => !prev)
  }, [])

  useEffect(() => {
    if (isElementSelectionActive) {
      console.log('Element selection mode activated')

      // Starts the ElementInteractionController when interactive mode is active
      const cleanupElementSelectionEvents = ElementInteractionController((element: HTMLElement) => {
        setSelectedRootElement(element)
        applyBorders(element, depth, bordersEnabled)
      })

      // Clean up event listeners when interaction mode is turned off
      return () => {
        if (cleanupElementSelectionEvents) {
          cleanupElementSelectionEvents()
        }
      }
    }
  }, [isElementSelectionActive, depth, bordersEnabled])

  useEffect(() => {
    if (selectedRootElement) {
      applyBorders(selectedRootElement, depth, bordersEnabled)
    }
  }, [bordersEnabled, depth, selectedRootElement])

  const contextValue = useMemo(
    () => ({
      bordersEnabled,
      setBordersEnabled,
      depth,
      setDepth,
      selectedRootElement,
      isElementSelectionActive,
      setIsElementSelectionActive,
      selectElementMode,
    }),
    [bordersEnabled, depth, selectedRootElement, selectElementMode], // added selectElementMode here
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
