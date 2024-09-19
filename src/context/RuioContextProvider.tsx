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
import ControlPanel from '@components/ControlPanel'

interface RuioContextProps {
  ruioEnabled: boolean // is ruio related state/interactions enabled
  setRuioEnabled: React.Dispatch<React.SetStateAction<boolean>> // toggle ruio related state/interactions
  depth: number // depth of the amount of elements to apply borders to
  setDepth: React.Dispatch<React.SetStateAction<number>> // set the depth of the amount of elements to apply borders to
  selectedRootElement: HTMLElement | null // the root element that is selected (defaults to where div.body#root)
  isElementSelectionModeActive: boolean // is element selection mode active -- aka are there hover and click events drilled into the DOM
  setIsElementSelectionModeActive: React.Dispatch<React.SetStateAction<boolean>> // toggle element selection mode
  toggleElementSelectionMode: () => void
}

const RuioContext = createContext<RuioContextProps | undefined>(undefined)

export const RuioContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ruioEnabled, setRuioEnabled] = useState(false)
  const [depth, setDepth] = useState(1)
  const [selectedRootElement, setSelectedRootElement] = useState<HTMLElement | null>(null)
  const [isElementSelectionModeActive, setIsElementSelectionModeActive] = useState(false)

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
  // const previousSelectedRootElementRef = useRef<HTMLElement | null>(null)

  /**
   * Triggers element selection mode by toggling the active state.
   * Wrapped in useCallback to maintain referential equality in contextValue.
   */
  const toggleElementSelectionMode = useCallback(() => {
    setIsElementSelectionModeActive((prev) => !prev)
  }, [])

  useEffect(() => {
    if (isElementSelectionModeActive) {
      // trigger ElementInteractionController (add click and hover events to DOM used for root element selection)
      const cleanupElementSelectionEvents = ElementInteractionController(
        (element: HTMLElement) => {
          applyBorders(element, depth, ruioEnabled)
        },
        (element: HTMLElement) => {
          setSelectedRootElement(element)
          setIsElementSelectionModeActive(false)
        },
      )

      return () => {
        if (cleanupElementSelectionEvents) {
          cleanupElementSelectionEvents()
        }
      }
    }
    // NOTE: should the cleanup function be saved to a ref to be called later when element selection mode is exited?
    // when an element is selected: yes [] no []
    // when an element is not selected: yes [] no []
  }, [isElementSelectionModeActive, depth, ruioEnabled])

  useEffect(() => {
    if (selectedRootElement) {
      applyBorders(selectedRootElement, depth, ruioEnabled)
    }
  }, [depth, selectedRootElement]) // NOTE: did include ruioEnabled at one point -- might need to add back

  const contextValue = useMemo(
    () => ({
      ruioEnabled,
      setRuioEnabled,
      depth,
      setDepth,
      selectedRootElement,
      isElementSelectionModeActive,
      setIsElementSelectionModeActive,
      toggleElementSelectionMode,
    }),
    [ruioEnabled, depth, selectedRootElement, toggleElementSelectionMode],
  )

  return (
    <RuioContext.Provider value={contextValue}>
      <ControlPanel ref={controlPanelRef} />
      {children}
    </RuioContext.Provider>
  )
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
