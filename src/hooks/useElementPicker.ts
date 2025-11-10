import { useState, useEffect, useCallback } from 'react'
import { applyPreviewOutlines, clearPreviewOutlines, clearSelectedOutlines } from '@utils/outline'
import { ElementPicker } from '@controllers/ElementPicker'
import { debounce } from '@utils/debounce'
import { getElementInfo } from '@utils/elementInfo'
import { ELEMENT_PICKER_DEBOUNCE_MS } from '@constants/index'

export interface PickerTooltipData {
  // React component info
  reactComponentName: string | null

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
 * react lifecycle orchestration for all things ElementPicking
 * delegates all events assigning and cleanup to ElementPicker() controller
 *
 * @param ruioEnabled - whether the ruio UI/feature is enabled
 * @param depth - current depth level for outline rendering
 * @param currentColorPalette - active color palette for outline styling
 * @param onElementPicked - callback invoked when user clicks an element
 *
 * @returns isActive - whether element picker mode is currently active
 * @returns setIsActive - setter^^
 * @returns toggle - function to toggle picker on/off
 * @returns tooltipData - current tooltip data for hovered element (null when not hovering)
 */
export const useElementPicker = ({
  ruioEnabled,
  depth,
  currentColorPalette,
  onElementPicked,
}: UseElementPickerOptions): UseElementPickerReturn => {
  const [isActive, setIsActive] = useState(false)
  const [tooltipData, setTooltipData] = useState<PickerTooltipData | null>(null)

  // NOTE: DONT TOUCH - this maintains referential equality and ensures components being passed this fn aren't triggered to rerender
  const toggle = useCallback(() => {
    setIsActive((prev) => !prev)
  }, [])

  useEffect(() => {
    if (ruioEnabled && isActive) {
      // cleanup any existing outline styling before making changes
      clearPreviewOutlines()
      clearSelectedOutlines()

      const debouncedHandleMouseOver = debounce((element: HTMLElement, x: number, y: number) => {
        applyPreviewOutlines(element, depth, currentColorPalette)

        // keep tooltip data synced
        const elementInfo = getElementInfo(element)
        setTooltipData({
          ...elementInfo,
          currentDepth: depth,
          x,
          y,
        })
      }, ELEMENT_PICKER_DEBOUNCE_MS)

      const debouncedHandleClick = debounce((element: HTMLElement) => {
        clearPreviewOutlines()
        setTooltipData(null)
        setIsActive(false) // really don't like that this setter comes from this hook instead of context...
        onElementPicked(element)
      }, ELEMENT_PICKER_DEBOUNCE_MS)

      const handleMouseOut = () => {
        setTooltipData(null)
      }

      const cleanupPickerEvents = ElementPicker(
        debouncedHandleClick,
        debouncedHandleMouseOver,
        handleMouseOut,
      )

      return () => {
        // clear preview outlines and force tooltip to re-render when exiting picker mode
        clearPreviewOutlines()
        setTooltipData(null)

        if (cleanupPickerEvents) {
          cleanupPickerEvents()
        }
      }
    } else {
      // force tooltip to re-render next time ruio is enabled/active
      setTooltipData(null)
    }
  }, [isActive, depth, ruioEnabled, currentColorPalette, onElementPicked])

  return { isActive, setIsActive, toggle, tooltipData }
}
