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

  useEffect(() => {
    if (!data || !rootElement) {
      setPosition(null)
      return
    }

    const updatePosition = () => {
      const rect = rootElement.getBoundingClientRect()
      const tooltipHeight = tooltipRef.current?.offsetHeight || 0
      const tooltipWidth = tooltipRef.current?.offsetWidth || 0

      // Position tooltip above the root element, aligned to the left
      // If there's not enough space above, position it below instead
      const spaceAbove = rect.top
      const spaceBelow = window.innerHeight - rect.bottom

      let x = rect.left + TOOLTIP_OFFSET
      let y: number

      if (spaceAbove >= tooltipHeight + MIN_SPACE_REQUIRED) {
        // Position above with padding
        y = rect.top - tooltipHeight - TOOLTIP_OFFSET
      } else if (spaceBelow >= tooltipHeight + MIN_SPACE_REQUIRED) {
        // Position below with padding
        y = rect.bottom + TOOLTIP_OFFSET
      } else {
        // Not enough space above or below, position inside at top
        y = rect.top + TOOLTIP_OFFSET
      }

      // Ensure tooltip doesn't go off screen horizontally
      const maxX = window.innerWidth - tooltipWidth - TOOLTIP_OFFSET
      x = Math.min(x, maxX)
      x = Math.max(TOOLTIP_OFFSET, x)

      setPosition({ x, y })
    }

    // Update position initially and on scroll/resize
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [data, rootElement])

  if (!data || !position) return null

  return (
    <Tooltip ref={tooltipRef} x={position.x} y={position.y} style={{ transform: 'none' }}>
      <TooltipContent data={data} />
    </Tooltip>
  )
}
