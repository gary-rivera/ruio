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
 * Helper to parse selected root from captured element
 * Filters out internal temporary classes like 'ruio-hovered'
 */
export const parseSelectorFromSelectedElement = (selectedElement: HTMLElement): string => {
  if (selectedElement.id) return `#${selectedElement.id}`

  // filter out internal ruio classes
  const classes = Array.from(selectedElement.classList).filter((cls) => !cls.startsWith('ruio-'))

  if (classes.length > 0) {
    return `.${classes.join('.')}`
  }

  // TODO: no identifiers

  return ''
}
