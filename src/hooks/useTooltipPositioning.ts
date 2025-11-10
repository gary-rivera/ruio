import { useEffect, useState, useCallback, RefObject } from 'react'

export interface Position {
  x: number
  y: number
}

interface UseTooltipPositioningOptions {
  targetElement: HTMLElement | null
  tooltipRef: RefObject<HTMLDivElement>
  offset: number
  minSpaceRequired: number
  isLocked: boolean // restricts updating when manual position is selected
}

/**
 * hook to calculate and manage tooltip positioning relative to a target element.
 * tries to position: above → below → right → left → top-right corner (fallback).
 */
export const useTooltipPositioning = ({
  targetElement,
  tooltipRef,
  offset,
  minSpaceRequired,
  isLocked,
}: UseTooltipPositioningOptions): Position | null => {
  const [position, setPosition] = useState<Position | null>(null)
  const [isInitialRender, setIsInitialRender] = useState(true)

  const calculatePosition = useCallback((): Position | null => {
    if (!targetElement) return null

    const targetRect = targetElement.getBoundingClientRect()
    const tooltipHeight = tooltipRef.current?.offsetHeight || 0
    const tooltipWidth = tooltipRef.current?.offsetWidth || 0

    // wait for tooltip to render and get actual dimensions
    if (isInitialRender && (tooltipHeight === 0 || tooltipWidth === 0)) {
      return null
    }

    const availableSpace = {
      above: targetRect.top,
      below: window.innerHeight - targetRect.bottom,
      left: targetRect.left,
      right: window.innerWidth - targetRect.right,
    }

    let x: number
    let y: number

    // try positioning above
    if (availableSpace.above >= tooltipHeight + minSpaceRequired) {
      x = targetRect.left + offset
      y = targetRect.top - tooltipHeight - offset
    }
    // try positioning below
    else if (availableSpace.below >= tooltipHeight + minSpaceRequired) {
      x = targetRect.left + offset
      y = targetRect.bottom + offset
    }
    // try positioning to the right
    else if (availableSpace.right >= tooltipWidth + minSpaceRequired) {
      x = targetRect.right + offset
      y = targetRect.top + offset
    }
    // try positioning to the left
    else if (availableSpace.left >= tooltipWidth + minSpaceRequired) {
      x = targetRect.left - tooltipWidth - offset
      y = targetRect.top + offset
    }
    // fallback: top-right corner of screen
    else {
      x = window.innerWidth - tooltipWidth - offset
      y = offset
    }

    // clamp to within bounds to avoid partial renders (off-screen)
    x = Math.max(offset, Math.min(x, window.innerWidth - tooltipWidth - offset))
    y = Math.max(offset, Math.min(y, window.innerHeight - tooltipHeight - offset))

    return { x, y }
  }, [targetElement, tooltipRef, offset, minSpaceRequired, isInitialRender])

  const updatePosition = useCallback(() => {
    if (isLocked) return

    const newPosition = calculatePosition()
    if (newPosition) {
      setPosition(newPosition)
      setIsInitialRender(false)
    }
  }, [isLocked, calculatePosition])

  useEffect(() => {
    if (!targetElement) {
      setPosition(null)
      setIsInitialRender(true)
      return
    }

    // fun fact: raf runs after layout calculations but before paints i.e. - offset values available
    const rafId = requestAnimationFrame(updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [targetElement, updatePosition])

  return position
}
