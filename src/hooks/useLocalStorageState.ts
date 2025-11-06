import { useState, useEffect, useCallback } from 'react'
import { getConfigValue, setConfigValueAtKey, loadConfig } from '@utils/config'
import type { ConfigLocalState } from '@utils/config'

/**
 * custom hook to update the value within config.
 * skipDefault: boolean is specifically to avoid defaulting to #root (not performant) when a user hasn't selected a root starting point
 * OR to use user chose specific settings we don't want to ignore.
 */
function usePersistedConfigValue<K extends keyof ConfigLocalState>(
  key: K,
  options?: { skipDefault?: boolean },
): [ConfigLocalState[K], React.Dispatch<React.SetStateAction<ConfigLocalState[K]>>] {
  const [state, setState] = useState<ConfigLocalState[K]>(() => getConfigValue(key)) // changes

  useEffect(() => {
    if (options?.skipDefault) {
      const storedConfig = loadConfig()
      setState((storedConfig?.[key] || '') as ConfigLocalState[K])
    } else {
      setState(getConfigValue(key))
    }
  }, [key, options?.skipDefault])

  // dynamic setter for state
  const setPersistedState = useCallback(
    (value: React.SetStateAction<ConfigLocalState[K]>) => {
      setState((prev) => {
        const newValue = typeof value === 'function' ? value(prev) : value
        setConfigValueAtKey(key, newValue)
        return newValue
      })
    },
    [key],
  )

  return [state, setPersistedState]
}

interface UseLocalStorageStateReturn {
  ruioEnabled: boolean
  setRuioEnabled: React.Dispatch<React.SetStateAction<boolean>>
  rootSelector: string
  setRootSelector: React.Dispatch<React.SetStateAction<string>>
  depth: number
  setDepth: React.Dispatch<React.SetStateAction<number>>
  currentColorPalette: string
  setCurrentColorPalette: React.Dispatch<React.SetStateAction<string>>
}

export const useLocalStorageState = (): UseLocalStorageStateReturn => {
  const [ruioEnabled, setRuioEnabled] = usePersistedConfigValue('ruioEnabled')
  const [rootSelectorRaw, setRootSelectorRaw] = usePersistedConfigValue('rootElementSelector', {
    skipDefault: true,
  })
  const [depth, setDepth] = usePersistedConfigValue('depth')
  const [currentColorPalette, setCurrentColorPalette] = usePersistedConfigValue('currentColorPalette')

  // ensure rootSelector defaults to empty string if undefined
  const rootSelector = (rootSelectorRaw || '') as string
  const setRootSelector = setRootSelectorRaw as React.Dispatch<React.SetStateAction<string>>

  return {
    ruioEnabled,
    setRuioEnabled,
    rootSelector,
    setRootSelector,
    depth,
    setDepth,
    currentColorPalette,
    setCurrentColorPalette,
  }
}
