import { useState, useEffect, useCallback } from 'react'
import { applyPreviewOutlines, clearPreviewOutlines } from '@utils/outline'
import { ElementInteractionController } from '@controllers/ElementInteractionController'
import { debounce } from '@utils/debounce'
import { getElementInfo } from '@utils/elementInfo'

export interface TooltipData {
  // React component info
  reactComponentName: string | null
  parentComponentName: string | null
  firstChildComponentName: string | null

  // HTML/CSS info
  tagName: string
  parentTag: string | null
  firstChildTag: string | null
  selector: string

  // Metrics
  depth: number | 'MAX_DEPTH_EXCEEDED'
  childrenCount: number
  siblingsCount: number

  // Position
  x: number
  y: number
}

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
  tooltipData: TooltipData | null
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
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null)

  // Toggle function wrapped in useCallback to maintain referential equality
  const toggle = useCallback(() => {
    setIsActive((prev) => !prev)
  }, [])

  useEffect(() => {
    if (ruioEnabled && isActive) {
      // Use preview outlines for hover (doesn't interfere with committed outlines)
      const debouncedPreview = debounce((element: HTMLElement, x: number, y: number) => {
        applyPreviewOutlines(element, depth, currentColorPalette)

        // Update tooltip data
        const elementInfo = getElementInfo(element)
        setTooltipData({
          ...elementInfo,
          x,
          y,
        })
      }, 50)

      const debouncedCommit = debounce((element: HTMLElement) => {
        // Clear preview outlines when an element is selected
        clearPreviewOutlines()
        setTooltipData(null)
        setIsActive(false)
        onElementSelected(element)
      }, 50)

      const handleMouseOut = () => {
        setTooltipData(null)
      }

      const cleanupSelection = ElementInteractionController(
        debouncedPreview,
        debouncedCommit,
        handleMouseOut,
      )

      return () => {
        // Clear preview outlines when exiting selection mode
        clearPreviewOutlines()
        setTooltipData(null)
        if (cleanupSelection) {
          cleanupSelection()
        }
      }
    } else {
      // Clear tooltip when selection mode is disabled
      setTooltipData(null)
    }
  }, [isActive, depth, ruioEnabled, currentColorPalette, onElementSelected])

  return { isActive, setIsActive, toggle, tooltipData }
}
