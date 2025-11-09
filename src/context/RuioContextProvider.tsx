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
import { applySelectedOutlines, calculateMaxDepth } from '@utils/outline'
import { useLocalStorageState } from '@hooks/useLocalStorageState'
import { useElementPicker, PickerTooltipData } from '@hooks/useElementPicker'
import { getElementInfo } from '@utils/elementInfo'
import { detectRootElement } from '@utils/config'

interface ContextProps {
  ruioEnabled: boolean // are ruio related state +/- interactions enabled
  setRuioEnabled: React.Dispatch<React.SetStateAction<boolean>> // dispatcher for ruio

  depth: number // depth of the amount of elements to apply outline UI to
  setDepth: React.Dispatch<React.SetStateAction<number>>
  maxDepth: number // maximum available depth in the current DOM tree

  rootElement: HTMLElement | null // the root element that is selected (defaults to div.body#root)

  isElementPickerActive: boolean // is element picker active -- aka are there hover and click events drilled into the DOM
  setIsElementPickerActive: React.Dispatch<React.SetStateAction<boolean>> // toggle element picker
  toggleElementPicker: () => void // cb to toggle element picker

  currentColorPalette: string // the key of the current color palette aka theme
  setCurrentColorPalette: React.Dispatch<React.SetStateAction<string>> // setter for the color palette theme

  theme: 'light' | 'dark' // current UI theme
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>> // setter for the theme

  tooltipData: PickerTooltipData | null // tooltip data for element picker
  persistedTooltipData: Omit<PickerTooltipData, 'x' | 'y'> | null // persisted tooltip data for selected root element
}

const Context = createContext<ContextProps | undefined>(undefined)

type ContextProviderProps = {
  children: ReactNode
  /**
   * Optional CSS selector for the default root element.
   * If not provided, ruio will auto-detect common patterns.
   */
  defaultRootSelector?: string
}

const DEFAULT_MAX_DEPTH_WITHOUT_ROOT = 100

export const RuioContextProvider = ({
  children,
  defaultRootSelector,
}: ContextProviderProps): ReactElement => {
  const localStorageState = useLocalStorageState()

  // local state fallback for SSR compatibility
  const [maxDepth, setMaxDepth] = useState(DEFAULT_MAX_DEPTH_WITHOUT_ROOT)
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null)
  const [persistedTooltipData, setPersistedTooltipData] = useState<
    Omit<PickerTooltipData, 'x' | 'y'> | null
  >(null)

  const depth = localStorageState.depth
  const setDepth = localStorageState.setDepth
  const currentColorPalette = localStorageState.currentColorPalette
  const setCurrentColorPalette = localStorageState.setCurrentColorPalette
  const theme = localStorageState.theme
  const setTheme = localStorageState.setTheme

  // on mount restore previously selected root element from localStorage or auto-detect
  useEffect(() => {
    const element = detectRootElement(localStorageState.rootSelector, defaultRootSelector)
    if (element) {
      setRootElement(element)
    }
  }, [localStorageState.rootSelector, defaultRootSelector])

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

  const handleRootPicked = useCallback(
    (element: HTMLElement) => {
      // Capture element info for persisted tooltip
      const elementInfo = getElementInfo(element)
      setPersistedTooltipData({
        ...elementInfo,
        currentDepth: depth,
      })

      // Set to null first, then to the element to force the useEffect to run
      // This ensures outlines are always reapplied, even when picking the same element
      setRootElement(null)
      // Use setTimeout to ensure the null state is processed before setting the new element
      setTimeout(() => {
        setRootElement(element)
      }, 0)
    },
    [depth],
  )

  const elementPicker = useElementPicker({
    ruioEnabled: localStorageState.ruioEnabled,
    depth,
    currentColorPalette,
    onElementPicked: handleRootPicked,
  })

  // apply theme to document root
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-ruio-theme', theme)
    }
  }, [theme])

  // react when settings or root element change by applying committed outlines
  useEffect(() => {
    if (rootElement) {
      applySelectedOutlines(rootElement, depth, localStorageState.ruioEnabled, currentColorPalette)
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
      isElementPickerActive: elementPicker.isActive,
      setIsElementPickerActive: elementPicker.setIsActive,
      toggleElementPicker: elementPicker.toggle,
      currentColorPalette,
      setCurrentColorPalette,
      theme,
      setTheme,
      tooltipData: elementPicker.tooltipData,
      persistedTooltipData,
    }),
    [
      localStorageState.ruioEnabled,
      localStorageState.setRuioEnabled,
      depth,
      setDepth,
      maxDepth,
      rootElement,
      elementPicker.isActive,
      elementPicker.setIsActive,
      elementPicker.toggle,
      currentColorPalette,
      setCurrentColorPalette,
      theme,
      setTheme,
      elementPicker.tooltipData,
      persistedTooltipData,
    ],
  )

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export const useRuioContext = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('[RuioContextProvider] useRuio must be used within RuioProvider')
  }
  return context
}
