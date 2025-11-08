import { useState, useEffect, useCallback } from 'react'
import { applyPreviewOutlines, clearPreviewOutlines } from '@utils/outline'
import { ElementPicker } from '@controllers/ElementPicker'
import { debounce } from '@utils/debounce'
import { getElementInfo } from '@utils/elementInfo'

export interface PickerTooltipData {
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
  currentDepth: number
  depth: number | 'MAX_DEPTH_EXCEEDED'
  childrenCount: number
  siblingsCount: number

  // Position
  x: number
  y: number
}

interface UseElementPickerOptions {
  ruioEnabled: boolean
  depth: number
  currentColorPalette: string
  onElementPicked: (element: HTMLElement) => void
}

interface UseElementPickerReturn {
  isActive: boolean
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>
  toggle: () => void
  tooltipData: PickerTooltipData | null
}

/**
 * Custom hook for managing element picker mode.
 * Handles hover interactions, element picking, and cleanup of event listeners.
 */
export const useElementPicker = ({
  ruioEnabled,
  depth,
  currentColorPalette,
  onElementPicked,
}: UseElementPickerOptions): UseElementPickerReturn => {
  const [isActive, setIsActive] = useState(false)
  const [tooltipData, setTooltipData] = useState<PickerTooltipData | null>(null)

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
          currentDepth: depth,
          x,
          y,
        })
      }, 50)

      const debouncedCommit = debounce((element: HTMLElement) => {
        // Clear preview outlines when an element is picked
        clearPreviewOutlines()
        setTooltipData(null)
        setIsActive(false)
        onElementPicked(element)
      }, 50)

      const handleMouseOut = () => {
        setTooltipData(null)
      }

      const cleanupPicker = ElementPicker(debouncedPreview, debouncedCommit, handleMouseOut)

      return () => {
        // Clear preview outlines when exiting picker mode
        clearPreviewOutlines()
        setTooltipData(null)
        if (cleanupPicker) {
          cleanupPicker()
        }
      }
    } else {
      // Clear tooltip when picker mode is disabled
      setTooltipData(null)
    }
  }, [isActive, depth, ruioEnabled, currentColorPalette, onElementPicked])

  return { isActive, setIsActive, toggle, tooltipData }
}
