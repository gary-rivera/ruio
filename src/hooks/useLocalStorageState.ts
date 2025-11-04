import { useState, useEffect, useCallback } from 'react'
import {
  getRuioEnabledLocalStorageValue,
  getRootSelectorLocalStorageValue,
  setLocalStorageValue,
} from '@utils/config'

interface UseLocalStorageStateReturn {
  ruioEnabled: boolean
  setRuioEnabled: React.Dispatch<React.SetStateAction<boolean>>
  rootSelector: string
  setRootSelector: React.Dispatch<React.SetStateAction<string>>
}

/**
 * Custom hook for managing ruio state in localStorage.
 * Handles initialization, updates, and persistence of ruioEnabled and rootSelector.
 */
export const useLocalStorageState = (): UseLocalStorageStateReturn => {
  const [ruioEnabled, setRuioEnabledState] = useState(false)
  const [rootSelector, setRootSelectorState] = useState('')

  // Initialize from localStorage on mount
  useEffect(() => {
    setRuioEnabledState(getRuioEnabledLocalStorageValue())
    setRootSelectorState(getRootSelectorLocalStorageValue())
  }, [])

  // Persist ruioEnabled to localStorage when it changes
  const setRuioEnabled = useCallback((value: React.SetStateAction<boolean>) => {
    setRuioEnabledState((prev) => {
      const newValue = typeof value === 'function' ? value(prev) : value
      setLocalStorageValue('ruioEnabled', newValue.toString())
      return newValue
    })
  }, [])

  // Persist rootSelector to localStorage when it changes
  const setRootSelector = useCallback((value: React.SetStateAction<string>) => {
    setRootSelectorState((prev) => {
      const newValue = typeof value === 'function' ? value(prev) : value
      setLocalStorageValue('rootElementSelector', newValue)
      return newValue
    })
  }, [])

  return {
    ruioEnabled,
    setRuioEnabled,
    rootSelector,
    setRootSelector,
  }
}
