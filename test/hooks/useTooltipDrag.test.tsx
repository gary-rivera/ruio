import { renderHook, act } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { useTooltipDrag } from '@hooks/useTooltipDrag'

describe('useTooltipDrag', () => {
  test('returns initial state correctly', () => {
    const { result } = renderHook(() =>
      useTooltipDrag({
        enabled: true,
        onDragEnd: vi.fn(),
      }),
    )

    expect(result.current.isDragging).toBe(false)
    expect(result.current.draggedPosition).toBeNull()
    expect(typeof result.current.handleMouseDown).toBe('function')
  })

  test('does not start dragging when enabled is false', () => {
    const { result } = renderHook(() =>
      useTooltipDrag({
        enabled: false,
        onDragEnd: vi.fn(),
      }),
    )

    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200,
    } as unknown as React.MouseEvent

    act(() => {
      result.current.handleMouseDown(mockEvent, { x: 50, y: 50 })
    })

    expect(result.current.isDragging).toBe(false)
  })

  test('initiates drag on mousedown when enabled', () => {
    const { result } = renderHook(() =>
      useTooltipDrag({
        enabled: true,
        onDragEnd: vi.fn(),
      }),
    )

    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200,
    } as unknown as React.MouseEvent

    act(() => {
      result.current.handleMouseDown(mockEvent, { x: 50, y: 50 })
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(result.current.isDragging).toBe(true)
  })

  test('updates position during drag', () => {
    const { result } = renderHook(() =>
      useTooltipDrag({
        enabled: true,
        onDragEnd: vi.fn(),
      }),
    )

    // Start drag at clientX: 100, clientY: 200 with current position 50, 50
    const mouseDownEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200,
    } as unknown as React.MouseEvent

    act(() => {
      result.current.handleMouseDown(mouseDownEvent, { x: 50, y: 50 })
    })

    // Drag offset should be: clientX - currentX = 100 - 50 = 50, clientY - currentY = 200 - 50 = 150

    // Move mouse to clientX: 300, clientY: 400
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 300,
      clientY: 400,
    })

    act(() => {
      document.dispatchEvent(mouseMoveEvent)
    })

    // New position should be: clientX - offset = 300 - 50 = 250, clientY - offset = 400 - 150 = 250
    expect(result.current.draggedPosition).toEqual({
      x: 250,
      y: 250,
    })
  })

  test('calls onDragEnd and stops dragging on mouseup', () => {
    const onDragEnd = vi.fn()
    const { result } = renderHook(() =>
      useTooltipDrag({
        enabled: true,
        onDragEnd,
      }),
    )

    const mouseDownEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200,
    } as unknown as React.MouseEvent

    act(() => {
      result.current.handleMouseDown(mouseDownEvent, { x: 50, y: 50 })
    })

    expect(result.current.isDragging).toBe(true)

    const mouseUpEvent = new MouseEvent('mouseup')

    act(() => {
      document.dispatchEvent(mouseUpEvent)
    })

    expect(result.current.isDragging).toBe(false)
    expect(onDragEnd).toHaveBeenCalledTimes(1)
  })

  test('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    const { result, unmount } = renderHook(() =>
      useTooltipDrag({
        enabled: true,
        onDragEnd: vi.fn(),
      }),
    )

    const mouseDownEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200,
    } as unknown as React.MouseEvent

    act(() => {
      result.current.handleMouseDown(mouseDownEvent, { x: 50, y: 50 })
    })

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))

    removeEventListenerSpy.mockRestore()
  })

  test('works without onDragEnd callback', () => {
    const { result } = renderHook(() =>
      useTooltipDrag({
        enabled: true,
      }),
    )

    const mouseDownEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200,
    } as unknown as React.MouseEvent

    act(() => {
      result.current.handleMouseDown(mouseDownEvent, { x: 50, y: 50 })
    })

    const mouseUpEvent = new MouseEvent('mouseup')

    act(() => {
      document.dispatchEvent(mouseUpEvent)
    })

    expect(result.current.isDragging).toBe(false)
  })

  test('maintains drag offset correctly across multiple moves', () => {
    const { result } = renderHook(() =>
      useTooltipDrag({
        enabled: true,
        onDragEnd: vi.fn(),
      }),
    )

    const mouseDownEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200,
    } as unknown as React.MouseEvent

    act(() => {
      result.current.handleMouseDown(mouseDownEvent, { x: 50, y: 50 })
    })

    // First move
    act(() => {
      document.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: 150,
          clientY: 250,
        }),
      )
    })

    expect(result.current.draggedPosition).toEqual({ x: 100, y: 100 })

    // Second move
    act(() => {
      document.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: 200,
          clientY: 300,
        }),
      )
    })

    expect(result.current.draggedPosition).toEqual({ x: 150, y: 150 })
  })
})
