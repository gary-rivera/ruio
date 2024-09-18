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
  selectElementMode: () => void
  selectedElement: HTMLElement | null
}

const RuioContext = createContext<RuioContextProps | undefined>(undefined)

export const RuioContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bordersEnabled, setBordersEnabled] = useState(false)
  const [depth, setDepth] = useState(1)
  const [interactedElement, setInteractedElement] = useState<HTMLElement | null>(null)
  const [interactiveModeActive, setInteractiveModeActive] = useState(false)

  /**
   * Triggers element selection mode by toggling the active state.
   * Wrapped in useCallback to maintain referential equality in contextValue.
   */
  const selectElementMode = useCallback(() => {
    setInteractiveModeActive((prev) => !prev)
  }, [])

  useEffect(() => {
    if (interactiveModeActive) {
      console.log('Element selection mode activated')

      // Starts the ElementInteractionController when interactive mode is active
      const cleanupElementSelectionEvents = ElementInteractionController((element: HTMLElement) => {
        setInteractedElement(element)
        applyBorders(element, depth, bordersEnabled)
      })

      // Clean up event listeners when interaction mode is turned off
      return () => {
        if (cleanupElementSelectionEvents) {
          cleanupElementSelectionEvents()
        }
        setInteractiveModeActive(false) // Reset interaction mode
      }
    }
  }, [interactiveModeActive, depth, bordersEnabled])

  useEffect(() => {
    if (interactedElement) {
      applyBorders(interactedElement, depth, bordersEnabled)
    }
  }, [bordersEnabled, depth, interactedElement])

  const contextValue = useMemo(
    () => ({
      bordersEnabled,
      setBordersEnabled,
      depth,
      setDepth,
      selectElementMode,
      selectedElement: interactedElement,
    }),
    [bordersEnabled, depth, interactedElement, selectElementMode], // added selectElementMode here
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
