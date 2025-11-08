import React, { useRef, useState, useMemo } from 'react'
import { PickerTooltipData } from '@hooks/useElementPicker'
import { useTooltipPositioning } from '@hooks/useTooltipPositioning'
import { useTooltipDrag } from '@hooks/useTooltipDrag'
import { Tooltip } from './Tooltip'
import { TooltipContent } from './TooltipContent'

interface PersistedElementTooltipProps {
  data: Omit<PickerTooltipData, 'x' | 'y'> | null
  rootElement: HTMLElement | null
}

const TOOLTIP_OFFSET = 12
const MIN_SPACE_REQUIRED = 24

/**
 * Draggable, auto-positioning tooltip that displays after a root element is selected.
 * - Auto-positions to avoid covering the target element
 * - User can drag to manually position
 * - Position persists after dragging (no auto-repositioning)
 * - Resets when a new element is selected
 */
export const PersistedElementTooltip: React.FC<PersistedElementTooltipProps> = ({
  data,
  rootElement,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [hasBeenManuallyPositioned, setHasBeenManuallyPositioned] = useState(false)

  // Auto-positioning (disabled after user drags)
  const autoPosition = useTooltipPositioning({
    targetElement: rootElement,
    tooltipRef,
    offset: TOOLTIP_OFFSET,
    minSpaceRequired: MIN_SPACE_REQUIRED,
    isLocked: hasBeenManuallyPositioned,
  })

  // Drag functionality
  const { isDragging, handleMouseDown, draggedPosition } = useTooltipDrag({
    enabled: true,
    onDragEnd: () => setHasBeenManuallyPositioned(true),
  })

  // Use dragged position if available, otherwise use auto position
  const position = draggedPosition ?? autoPosition

  // Reset manual positioning when data changes (new element selected)
  if (!data && hasBeenManuallyPositioned) {
    setHasBeenManuallyPositioned(false)
  }

  if (!data) return null

  // Memoize style to avoid recreating object on every render
  const tooltipStyle = useMemo(() => {
    if (!position) {
      // Render off-screen initially to measure dimensions
      return {
        transform: 'none',
        visibility: 'hidden' as const,
        left: '-9999px',
        top: '-9999px',
      }
    }

    return {
      transform: 'none',
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none' as const,
      pointerEvents: 'auto' as const,
    }
  }, [position, isDragging])

  const handleDragStart = (e: React.MouseEvent) => {
    if (position) {
      handleMouseDown(e, position)
    }
  }

  return (
    <Tooltip ref={tooltipRef} x={position?.x ?? 0} y={position?.y ?? 0} style={tooltipStyle}>
      <div onMouseDown={handleDragStart}>
        <TooltipContent data={data} />
      </div>
    </Tooltip>
  )
}
