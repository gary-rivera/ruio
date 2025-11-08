import React, { useState, useEffect, useRef } from 'react'
import { TooltipData } from '@hooks/useElementSelection'
import { Tooltip } from './Tooltip'
import { TooltipContent } from './TooltipContent'

interface PersistedElementTooltipProps {
  data: Omit<TooltipData, 'x' | 'y'> | null
  rootElement: HTMLElement | null
}

// Positioning constants
const TOOLTIP_OFFSET = 12 // px offset from element edges and screen edges
const MIN_SPACE_REQUIRED = 24 // Minimum space needed to position tooltip outside element

/**
 * Persisted tooltip that displays after a root element is selected.
 * Positioned near the top-left of the selected root element.
 * Reuses the same styles and structure as ElementSelectionTooltip.
 */
export const PersistedElementTooltip: React.FC<PersistedElementTooltipProps> = ({
  data,
  rootElement,
}) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [isInitialRender, setIsInitialRender] = useState(true)

  useEffect(() => {
    if (!data || !rootElement) {
      setPosition(null)
      return
    }

    const updatePosition = () => {
      const rect = rootElement.getBoundingClientRect()
      const tooltipHeight = tooltipRef.current?.offsetHeight || 0
      const tooltipWidth = tooltipRef.current?.offsetWidth || 0

      // Wait for tooltip to render and get actual dimensions
      if (isInitialRender && (tooltipHeight === 0 || tooltipWidth === 0)) {
        return
      }

      // Calculate available space in all directions
      const spaceAbove = rect.top
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceLeft = rect.left
      const spaceRight = window.innerWidth - rect.right

      let x: number
      let y: number

      // Priority 1: Position above if there's enough space
      if (spaceAbove >= tooltipHeight + MIN_SPACE_REQUIRED) {
        x = rect.left + TOOLTIP_OFFSET
        y = rect.top - tooltipHeight - TOOLTIP_OFFSET
      }
      // Priority 2: Position below if there's enough space
      else if (spaceBelow >= tooltipHeight + MIN_SPACE_REQUIRED) {
        x = rect.left + TOOLTIP_OFFSET
        y = rect.bottom + TOOLTIP_OFFSET
      }
      // Priority 3: Position to the right if there's enough space
      else if (spaceRight >= tooltipWidth + MIN_SPACE_REQUIRED) {
        x = rect.right + TOOLTIP_OFFSET
        y = rect.top + TOOLTIP_OFFSET
      }
      // Priority 4: Position to the left if there's enough space
      else if (spaceLeft >= tooltipWidth + MIN_SPACE_REQUIRED) {
        x = rect.left - tooltipWidth - TOOLTIP_OFFSET
        y = rect.top + TOOLTIP_OFFSET
      }
      // Fallback: Position in top-right corner of screen (avoid covering element)
      else {
        x = window.innerWidth - tooltipWidth - TOOLTIP_OFFSET
        y = TOOLTIP_OFFSET
      }

      // Ensure tooltip stays on screen
      x = Math.max(TOOLTIP_OFFSET, Math.min(x, window.innerWidth - tooltipWidth - TOOLTIP_OFFSET))
      y = Math.max(TOOLTIP_OFFSET, Math.min(y, window.innerHeight - tooltipHeight - TOOLTIP_OFFSET))

      setPosition({ x, y })
      setIsInitialRender(false)
    }

    // Update position initially and on scroll/resize
    // Use requestAnimationFrame to ensure DOM has updated
    const rafId = requestAnimationFrame(updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [data, rootElement, isInitialRender])

  if (!data) return null

  // Render off-screen initially to measure dimensions
  const style = position
    ? { transform: 'none' }
    : { transform: 'none', visibility: 'hidden' as const, left: '-9999px', top: '-9999px' }

  return (
    <Tooltip
      ref={tooltipRef}
      x={position?.x ?? 0}
      y={position?.y ?? 0}
      style={style}
    >
      <TooltipContent data={data} />
    </Tooltip>
  )
}
