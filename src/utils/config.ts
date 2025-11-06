import { UI_DEPTH, COLOR_PALETTE, RUIO_ENABLED, ROOT_ELEMENT_SELECTOR } from '@constants/index'

// local storage key
const RUIO_CONFIG_KEY = 'ruio-config'

export interface ConfigLocalState {
  ruioEnabled: boolean
  depth: number
  currentColorPalette: string
  rootElementSelector?: string
}

const DEFAULT_CONFIG: ConfigLocalState = {
  ruioEnabled: RUIO_ENABLED,
  depth: UI_DEPTH,
  currentColorPalette: COLOR_PALETTE,
  rootElementSelector: ROOT_ELEMENT_SELECTOR,
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
 * Filters out internal temporary classes like 'ruio-hovered'
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
