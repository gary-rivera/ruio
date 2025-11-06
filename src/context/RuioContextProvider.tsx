import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  ReactElement,
  useContext,
  useMemo,
  useCallback,
} from 'react'
import { applyOutlineUI, calculateMaxDepth } from '@utils/outline'
import { useLocalStorageState } from '@hooks/useLocalStorageState'
import { useElementSelection } from '@hooks/useElementSelection'

interface RuioContextProps {
  ruioEnabled: boolean // are ruio related state +/- interactions enabled
  setRuioEnabled: React.Dispatch<React.SetStateAction<boolean>> // dispatcher for ruio

  depth: number // depth of the amount of elements to apply outline UI to
  setDepth: React.Dispatch<React.SetStateAction<number>>
  maxDepth: number // maximum available depth in the current DOM tree

  rootElement: HTMLElement | null // the root element that is selected (defaults to div.body#root)

  isElementSelectionModeActive: boolean // is element selection mode active -- aka are there hover and click events drilled into the DOM
  setIsElementSelectionModeActive: React.Dispatch<React.SetStateAction<boolean>> // toggle element selection mode
  toggleElementSelectionMode: () => void // cb to toggle element selection mode (for clarity, might remove)

  currentColorPalette: string // the key of the current color palette aka theme
  setCurrentColorPalette: React.Dispatch<React.SetStateAction<string>> // setter for the color palette theme
}

const RuioContext = createContext<RuioContextProps | undefined>(undefined)

type RuioContextProviderProps = { children: ReactNode }

const DEFAULT_MAX_DEPTH_WITHOUT_ROOT = 100

export const RuioContextProvider = ({ children }: RuioContextProviderProps): ReactElement => {
  const localStorageState = useLocalStorageState()

  // local state fallback for SSR compatibility
  const [maxDepth, setMaxDepth] = useState(DEFAULT_MAX_DEPTH_WITHOUT_ROOT)
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null)

  const depth = localStorageState.depth
  const setDepth = localStorageState.setDepth
  const currentColorPalette = localStorageState.currentColorPalette
  const setCurrentColorPalette = localStorageState.setCurrentColorPalette

  // on mount restore previously selected root element from localStorage
  useEffect(() => {
    if (localStorageState.rootSelector) {
      const element = document.querySelector(localStorageState.rootSelector) as HTMLElement
      if (element) {
        setRootElement(element)
      }
    }
  }, [localStorageState.rootSelector])

  // when root element changes recalc maximum available depth
  useEffect(() => {
    if (!rootElement) return

    const actualMaxDepth = calculateMaxDepth(rootElement)
    setMaxDepth(actualMaxDepth)

    setDepth((currentDepth) => Math.min(currentDepth, actualMaxDepth))
  }, [rootElement, setDepth])

  // guard against depth exceeding maxDepth, namely programmatic depth changes
  useEffect(() => {
    const isDepthExceedingLimit = depth > maxDepth
    if (isDepthExceedingLimit) {
      setDepth(maxDepth)
    }
  }, [depth, maxDepth, setDepth])

  const handleElementSelected = useCallback((element: HTMLElement) => {
    setRootElement(element)
  }, [])

  const elementSelection = useElementSelection({
    ruioEnabled: localStorageState.ruioEnabled,
    depth,
    currentColorPalette,
    onElementSelected: handleElementSelected,
  })

  // react when settings or root element change by applying ui styles
  useEffect(() => {
    if (rootElement) {
      applyOutlineUI(rootElement, depth, localStorageState.ruioEnabled, currentColorPalette)
    }
  }, [depth, rootElement, localStorageState.ruioEnabled, currentColorPalette])

  const contextValue = useMemo(
    () => ({
      ruioEnabled: localStorageState.ruioEnabled,
      setRuioEnabled: localStorageState.setRuioEnabled,
      depth,
      setDepth,
      maxDepth,
      rootElement,
      isElementSelectionModeActive: elementSelection.isActive,
      setIsElementSelectionModeActive: elementSelection.setIsActive,
      toggleElementSelectionMode: elementSelection.toggle,
      currentColorPalette,
      setCurrentColorPalette,
    }),
    [
      localStorageState.ruioEnabled,
      localStorageState.setRuioEnabled,
      depth,
      setDepth,
      maxDepth,
      rootElement,
      elementSelection.isActive,
      elementSelection.setIsActive,
      elementSelection.toggle,
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
