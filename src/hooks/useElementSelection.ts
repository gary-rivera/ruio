import { useState, useEffect, useCallback } from 'react'
import { applyOutlineUI } from '@utils/outline'
import { ElementInteractionController } from '@controllers/ElementInteractionController'
import { debounce } from '@utils/debounce'

interface UseElementSelectionOptions {
  ruioEnabled: boolean
  depth: number
  currentColorPalette: string
  onElementSelected: (element: HTMLElement) => void
}

interface UseElementSelectionReturn {
  isActive: boolean
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>
  toggle: () => void
}

/**
 * Custom hook for managing element selection mode.
 * Handles hover interactions, element selection, and cleanup of event listeners.
 */
export const useElementSelection = ({
  ruioEnabled,
  depth,
  currentColorPalette,
  onElementSelected,
}: UseElementSelectionOptions): UseElementSelectionReturn => {
  const [isActive, setIsActive] = useState(false)

  // Toggle function wrapped in useCallback to maintain referential equality
  const toggle = useCallback(() => {
    setIsActive((prev) => !prev)
  }, [])

  useEffect(() => {
    if (ruioEnabled && isActive) {
      const debouncedApplyOutline = debounce((element: HTMLElement) => {
        applyOutlineUI(element, depth, ruioEnabled, currentColorPalette)
      }, 50)

      const debouncedSetSelection = debounce((element: HTMLElement) => {
        setIsActive(false)
        onElementSelected(element)
      }, 50)

      const cleanupElementSelectionEvents = ElementInteractionController(
        debouncedApplyOutline,
        debouncedSetSelection,
      )

      return () => {
        if (cleanupElementSelectionEvents) {
          cleanupElementSelectionEvents()
        }
      }
    }
  }, [isActive, depth, ruioEnabled, currentColorPalette, onElementSelected])

  return { isActive, setIsActive, toggle }
}
