import { renderHook, waitFor } from '@testing-library/react'
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest'
import { useTooltipPositioning } from '@hooks/useTooltipPositioning'
import { RefObject } from 'react'

describe('useTooltipPositioning', () => {
  let targetElement: HTMLElement
  let tooltipRef: RefObject<HTMLDivElement>

  beforeEach(() => {
    // Create mock target element
    targetElement = document.createElement('div')
    document.body.appendChild(targetElement)

    // Create mock tooltip ref
    const tooltipElement = document.createElement('div')
    tooltipRef = { current: tooltipElement }

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true })
  })

  afterEach(() => {
    document.body.removeChild(targetElement)
  })

  test('returns null when targetElement is null', () => {
    const { result } = renderHook(() =>
      useTooltipPositioning({
        targetElement: null,
        tooltipRef,
        offset: 12,
        minSpaceRequired: 24,
        isLocked: false,
      }),
    )

    expect(result.current).toBeNull()
  })

  test('returns null on initial render when tooltip dimensions are 0', () => {
    // Tooltip has no dimensions yet
    vi.spyOn(tooltipRef.current!, 'offsetHeight', 'get').mockReturnValue(0)
    vi.spyOn(tooltipRef.current!, 'offsetWidth', 'get').mockReturnValue(0)

    const { result } = renderHook(() =>
      useTooltipPositioning({
        targetElement,
        tooltipRef,
        offset: 12,
        minSpaceRequired: 24,
        isLocked: false,
      }),
    )

    expect(result.current).toBeNull()
  })

  test('positions tooltip above target when space is available', async () => {
    // Mock target at middle of screen
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
      top: 500,
      bottom: 550,
      left: 100,
      right: 300,
      width: 200,
      height: 50,
      x: 100,
      y: 500,
      toJSON: () => ({}),
    })

    // Mock tooltip dimensions
    vi.spyOn(tooltipRef.current!, 'offsetHeight', 'get').mockReturnValue(100)
    vi.spyOn(tooltipRef.current!, 'offsetWidth', 'get').mockReturnValue(200)

    const { result } = renderHook(() =>
      useTooltipPositioning({
        targetElement,
        tooltipRef,
        offset: 12,
        minSpaceRequired: 24,
        isLocked: false,
      }),
    )

    // Wait for requestAnimationFrame to complete
    await waitFor(() => {
      expect(result.current).not.toBeNull()
    })

    // Should position above: y = 500 - 100 - 12 = 388
    expect(result.current).toEqual({
      x: 112, // 100 + 12
      y: 388, // 500 - 100 - 12
    })
  })

  test('positions tooltip below target when no space above', async () => {
    // Mock target near top of screen
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
      top: 50,
      bottom: 100,
      left: 100,
      right: 300,
      width: 200,
      height: 50,
      x: 100,
      y: 50,
      toJSON: () => ({}),
    })

    vi.spyOn(tooltipRef.current!, 'offsetHeight', 'get').mockReturnValue(100)
    vi.spyOn(tooltipRef.current!, 'offsetWidth', 'get').mockReturnValue(200)

    const { result } = renderHook(() =>
      useTooltipPositioning({
        targetElement,
        tooltipRef,
        offset: 12,
        minSpaceRequired: 24,
        isLocked: false,
      }),
    )

    // Wait for requestAnimationFrame to complete
    await waitFor(() => {
      expect(result.current).not.toBeNull()
    })

    // Should position below: y = 100 + 12 = 112
    expect(result.current).toEqual({
      x: 112,
      y: 112,
    })
  })

  test('positions tooltip to the right when no space above or below', async () => {
    // Mock target taking up most vertical space
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 1000,
      left: 100,
      right: 300,
      width: 200,
      height: 900,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    })

    vi.spyOn(tooltipRef.current!, 'offsetHeight', 'get').mockReturnValue(100)
    vi.spyOn(tooltipRef.current!, 'offsetWidth', 'get').mockReturnValue(200)

    const { result } = renderHook(() =>
      useTooltipPositioning({
        targetElement,
        tooltipRef,
        offset: 12,
        minSpaceRequired: 24,
        isLocked: false,
      }),
    )

    // Wait for requestAnimationFrame to complete
    await waitFor(() => {
      expect(result.current).not.toBeNull()
    })

    // Should position to the right: x = 300 + 12 = 312
    expect(result.current).toEqual({
      x: 312,
      y: 112, // 100 + 12
    })
  })

  test('does not update position when isLocked is true', () => {
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
      top: 500,
      bottom: 550,
      left: 100,
      right: 300,
      width: 200,
      height: 50,
      x: 100,
      y: 500,
      toJSON: () => ({}),
    })

    vi.spyOn(tooltipRef.current!, 'offsetHeight', 'get').mockReturnValue(100)
    vi.spyOn(tooltipRef.current!, 'offsetWidth', 'get').mockReturnValue(200)

    const { result, rerender } = renderHook(
      ({ isLocked }) =>
        useTooltipPositioning({
          targetElement,
          tooltipRef,
          offset: 12,
          minSpaceRequired: 24,
          isLocked,
        }),
      { initialProps: { isLocked: false } },
    )

    const initialPosition = result.current

    // Lock the position
    rerender({ isLocked: true })

    // Position should remain the same even if we change target
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
      top: 800,
      bottom: 850,
      left: 500,
      right: 700,
      width: 200,
      height: 50,
      x: 500,
      y: 800,
      toJSON: () => ({}),
    })

    rerender({ isLocked: true })

    expect(result.current).toEqual(initialPosition)
  })

  test('clamps position to screen bounds', async () => {
    // Mock target near right edge
    vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
      top: 500,
      bottom: 550,
      left: 1800,
      right: 1900,
      width: 100,
      height: 50,
      x: 1800,
      y: 500,
      toJSON: () => ({}),
    })

    vi.spyOn(tooltipRef.current!, 'offsetHeight', 'get').mockReturnValue(100)
    vi.spyOn(tooltipRef.current!, 'offsetWidth', 'get').mockReturnValue(300)

    const { result } = renderHook(() =>
      useTooltipPositioning({
        targetElement,
        tooltipRef,
        offset: 12,
        minSpaceRequired: 24,
        isLocked: false,
      }),
    )

    // Wait for requestAnimationFrame to complete
    await waitFor(() => {
      expect(result.current).not.toBeNull()
    })

    // X should be clamped: max = 1920 - 300 - 12 = 1608
    expect(result.current!.x).toBeLessThanOrEqual(1608)
    expect(result.current!.x).toBeGreaterThanOrEqual(12)
  })
})
