import { useState, useEffect, useCallback } from 'react'
import { applyPreviewOutlineUI, clearPreviewOutlines } from '@utils/outline'
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
      // Use preview outlines for hover (doesn't interfere with committed outlines)
      const debouncedPreview = debounce((element: HTMLElement) => {
        applyPreviewOutlineUI(element, depth, currentColorPalette)
      }, 50)

      const debouncedCommit = debounce((element: HTMLElement) => {
        // Clear preview outlines when an element is selected
        clearPreviewOutlines()
        setIsActive(false)
        onElementSelected(element)
      }, 50)

      const cleanupSelection = ElementInteractionController(debouncedPreview, debouncedCommit)

      return () => {
        // Clear preview outlines when exiting selection mode
        clearPreviewOutlines()
        if (cleanupSelection) {
          cleanupSelection()
        }
      }
    }
  }, [isActive, depth, ruioEnabled, currentColorPalette, onElementSelected])

  return { isActive, setIsActive, toggle }
}
