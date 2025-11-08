import { useEffect, useState, useRef, useCallback } from 'react'
import { Position } from './useTooltipPositioning'

interface UseTooltipDragOptions {
  enabled: boolean
  onDragEnd?: () => void
}

interface UseTooltipDragReturn {
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent, currentPosition: Position) => void
  draggedPosition: Position | null
}

/**
 * Hook to handle drag functionality for a tooltip.
 * Manages drag state and position updates during dragging.
 */
export const useTooltipDrag = ({ enabled, onDragEnd }: UseTooltipDragOptions): UseTooltipDragReturn => {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedPosition, setDraggedPosition] = useState<Position | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, currentPosition: Position) => {
      if (!enabled) return

      e.preventDefault()
      dragOffset.current = {
        x: e.clientX - currentPosition.x,
        y: e.clientY - currentPosition.y,
      }
      setIsDragging(true)
    },
    [enabled],
  )

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      setDraggedPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      onDragEnd?.()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, onDragEnd])

  return { isDragging, handleMouseDown, draggedPosition }
}
