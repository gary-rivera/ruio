import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { applyBorders } from '../utils/applyBorders'
import { ElementInteractionController } from '../controllers/ElementInteractionController'

interface RuioContextProps {
  ruioEnabled: boolean
  setRuioEnabled: React.Dispatch<React.SetStateAction<boolean>>
  depth: number
  setDepth: React.Dispatch<React.SetStateAction<number>>
  selectedRootElement: HTMLElement | null
  isElementSelectionActive: boolean
  setIsElementSelectionActive: React.Dispatch<React.SetStateAction<boolean>>
  selectElementMode: () => void
}

const RuioContext = createContext<RuioContextProps | undefined>(undefined)

export const RuioContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ruioEnabled, setRuioEnabled] = useState(false)
  const [depth, setDepth] = useState(1)
  const [selectedRootElement, setSelectedRootElement] = useState<HTMLElement | null>(null)
  const [isElementSelectionActive, setIsElementSelectionActive] = useState(false)

  const previousSelectedRootElementRef = useRef<HTMLElement | null>(null)

  const garyIsStuck = false
  if (garyIsStuck) {
    console.log('RuioContextProvider', {
      ruioEnabled,
      depth,
      selectedRootElement,
      isElementSelectionActive,
    })
  }

  /**
   * Triggers element selection mode by toggling the active state.
   * Wrapped in useCallback to maintain referential equality in contextValue.
   */
  // enabling the selectElementMode will
  // toggle the isElementSelectionActive state
  // isElementSelectionActive state will be activated
  // // ElementInteractionController (click and hover events are applied to DOM)
  // // applyBorders (borders are applied to the current hovered element)

  // toggleElementSelectMode should be the name of the function
  // regardless of the state toggle the isElementSelectionActive state

  // // isElementSelectionActive is toggled won
  // // // ElementInteractionController (click and hover events are applied to DOM)
  // // // apply borders UI to whichecer element is hovered over (maybe this is handled by the ElementInteractionController??)

  // // isElementSelectionActive is toggled off

  const selectElementMode = useCallback(() => {
    setIsElementSelectionActive((prev) => !prev)
  }, [])

  useEffect(() => {
    if (isElementSelectionActive) {
      console.log('Element selection mode activated')

      // Starts the ElementInteractionController when interactive mode is active
      const cleanupElementSelectionEvents = ElementInteractionController((element: HTMLElement) => {
        setSelectedRootElement(element)
        applyBorders(element, depth, ruioEnabled)
      })

      // Clean up event listeners when interaction mode is turned off
      return () => {
        if (cleanupElementSelectionEvents) {
          cleanupElementSelectionEvents()
        }
      }
    }
  }, [isElementSelectionActive, depth, ruioEnabled])

  useEffect(() => {
    if (selectedRootElement) {
      applyBorders(selectedRootElement, depth, ruioEnabled)
    }
  }, [ruioEnabled, depth, selectedRootElement])

  const contextValue = useMemo(
    () => ({
      ruioEnabled,
      setRuioEnabled,
      depth,
      setDepth,
      selectedRootElement,
      isElementSelectionActive,
      setIsElementSelectionActive,
      selectElementMode,
    }),
    [ruioEnabled, depth, selectedRootElement, selectElementMode], // added selectElementMode here
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
