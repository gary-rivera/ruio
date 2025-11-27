import React, { useRef, useState, useMemo } from 'react'
import { PickerTooltipData } from '@hooks/useElementPicker'
import { useTooltipPositioning } from '@hooks/useTooltipPositioning'
import { useTooltipDrag } from '@hooks/useTooltipDrag'
import { Tooltip } from './Tooltip'
import { TooltipContent } from './TooltipContent'

interface ElementSelectedTooltipProps {
  data: Omit<PickerTooltipData, 'x' | 'y'> | null
  rootElement: HTMLElement | null
}

const TOOLTIP_OFFSET = 12
const MIN_SPACE_REQUIRED = 24

/**
 * draggable tooltip that renders once a root element has been selected.
 * - displays the metadata of a hovered element
 * - Auto-positions to avoid covering the target element
 * - User can drag to manually position
 * - Position persists after dragging (no auto-repositioning)
 * - Resets when a new element is selected
 */
export const ElementSelectedTooltip: React.FC<ElementSelectedTooltipProps> = ({ data, rootElement }) => {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [hasBeenManuallyPositioned, setHasBeenManuallyPositioned] = useState(false)

  // disabled after user drags, as draggedPosition takes priority
  const autoPosition = useTooltipPositioning({
    targetElement: rootElement,
    tooltipRef,
    offset: TOOLTIP_OFFSET,
    minSpaceRequired: MIN_SPACE_REQUIRED,
    isLocked: hasBeenManuallyPositioned,
  })

  const { isDragging, handleMouseDown, draggedPosition } = useTooltipDrag({
    enabled: true,
    onDragEnd: () => setHasBeenManuallyPositioned(true),
  })

  // prioritize dragged to position
  const position = draggedPosition ?? autoPosition

  // reset manual positioning when data changes (new element selected)
  if (!data && hasBeenManuallyPositioned) {
    setHasBeenManuallyPositioned(false)
  }

  if (!data) return null

  // avoids recreating this object on every re-render
  const tooltipStyle = useMemo(() => {
    if (!position) {
      // render off-screen initially for measuring dimensions w/o appearing to user
      return {
        transform: 'none',
        visibility: 'hidden' as const,
        // a.k.a off screen
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
