import { UI_DEPTH, COLOR_PALETTE, RUIO_ENABLED, ROOT_ELEMENT_SELECTOR } from '@constants/index'

// local storage key
const RUIO_CONFIG_KEY = 'ruio-config'

export interface ConfigLocalState {
  ruioEnabled: boolean
  depth: number
  currentColorPalette: string
  rootElementSelector?: string
  theme?: 'light' | 'dark'
}

const DEFAULT_CONFIG: ConfigLocalState = {
  ruioEnabled: RUIO_ENABLED,
  depth: UI_DEPTH,
  currentColorPalette: COLOR_PALETTE,
  rootElementSelector: ROOT_ELEMENT_SELECTOR,
  theme: 'dark',
}

const isStorageAvailable = (): boolean => {
  return typeof window !== 'undefined'
}

export const loadConfig = (): ConfigLocalState | null => {
  if (!isStorageAvailable()) return null

  try {
    const stored = localStorage.getItem(RUIO_CONFIG_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Failed to load ruio config:', error)
    return null
  }
}

export const saveConfig = (config: ConfigLocalState): void => {
  if (!isStorageAvailable()) return

  try {
    localStorage.setItem(RUIO_CONFIG_KEY, JSON.stringify(config))
  } catch (error) {
    console.error('Failed to save ruio config:', error)
  }
}

/**
 * Get a specific config value
 * Returns the stored value or the default if not found
 */
export const getConfigValue = <K extends keyof ConfigLocalState>(key: K): ConfigLocalState[K] => {
  const config = loadConfig()
  return config?.[key] ?? DEFAULT_CONFIG[key]
}

export const setConfigValueAtKey = <K extends keyof ConfigLocalState>(
  key: K,
  value: ConfigLocalState[K],
): void => {
  if (!isStorageAvailable()) return

  const currentConfig = loadConfig() ?? { ...DEFAULT_CONFIG }
  const updatedConfig = { ...currentConfig, [key]: value }

  saveConfig(updatedConfig)
}

export const resetConfig = (): void => {
  if (!isStorageAvailable()) return

  try {
    localStorage.removeItem(RUIO_CONFIG_KEY)
  } catch (error) {
    console.error('Failed to reset ruio config:', error)
  }
}

/**
 * get the full config, using defaults for missing values
 */
export const getConfigWithDefaults = (): ConfigLocalState => {
  const stored = loadConfig()
  return stored ? { ...DEFAULT_CONFIG, ...stored } : { ...DEFAULT_CONFIG }
}

/**
 * Generate a CSS selector path for an element without ID or useful classes
 * Uses tag name and nth-of-type to create a unique selector path
 */
const generateSelectorPath = (element: HTMLElement): string => {
  const path: string[] = []
  let current: HTMLElement | null = element

  while (current && current !== document.body) {
    const tagName = current.tagName.toLowerCase()

    const siblings = Array.from(current.parentElement?.children || []).filter(
      (el) => el.tagName === current!.tagName,
    )
    const index = siblings.indexOf(current) + 1

    // add to path with nth-of-type based on siblings, if needed
    if (siblings.length > 1) {
      path.unshift(`${tagName}:nth-of-type(${index})`)
    } else {
      path.unshift(tagName)
    }

    current = current.parentElement
  }

  return path.join(' > ')
}

/**
 * Helper to parse selected root from captured element
 * Filters out internally generated classes like 'ruio-hovered'
 * Falls back to generating a selector path if no ID or classes exist
 */
export const parseSelectorFromSelectedElement = (selectedElement: HTMLElement): string => {
  // p1 - ID selector (most specific and stable)
  if (selectedElement.id) return `#${selectedElement.id}`

  // p2 - class selector (filter out internal ruio classes)
  const classes = Array.from(selectedElement.classList).filter((cls) => !cls.startsWith('ruio-'))

  if (classes.length > 0) {
    return `.${classes.join('.')}`
  }

  // fallback
  return generateSelectorPath(selectedElement)
}

/**
 * Detects the root element to apply initial UI to based on a priority cascade:
 * 1. User's saved selection from localStorage
 * 2. Custom defaultRootSelector prop provided by user
 * 3. Common fallback patterns (auto-detection)
 *
 * @param savedSelector - Selector stored in localStorage from previous session
 * @param customSelector - Optional selector provided via RuioWrapper prop
 * @returns The detected HTMLElement or null if none found
 */
export const detectRootElement = (
  savedSelector: string | undefined,
  customSelector: string | undefined,
): HTMLElement | null => {
  // Priority 1: User's saved selection from localStorage
  if (savedSelector) {
    const element = document.querySelector(savedSelector) as HTMLElement
    if (element) {
      return element
    }
  }

  // Priority 2: Custom defaultRootSelector prop provided by user
  if (customSelector) {
    try {
      const element = document.querySelector(customSelector) as HTMLElement
      if (element) {
        return element
      } else {
        console.warn(
          `[ruio] Could not find element with selector "${customSelector}". No root element set.`,
        )
      }
    } catch (error) {
      console.warn(`[ruio] Invalid selector "${customSelector}":`, error)
    }
    return null // Don't fall through to auto-detection if custom selector was provided
  }

  // Priority 3: Common fallback patterns (auto-detection) - only if no custom selector
  const fallbackSelectors = ['#root', '#app', '[data-reactroot]', 'body > div:first-child']

  for (const selector of fallbackSelectors) {
    try {
      const element = document.querySelector(selector) as HTMLElement
      if (element) {
        return element
      }
    } catch (error) {
      // Invalid selector, continue to next fallback
      continue
    }
  }

  // If all else fails, log a warning to help developers debug
  console.warn(
    '[ruio] Could not find a root element. Please ensure your app has an element with id="root", id="app", or pass a custom defaultRootSelector prop.',
  )
  return null
}
