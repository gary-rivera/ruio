import { renderHook, act } from '@testing-library/react'
import { useElementPicker } from '@hooks/useElementPicker'
import { ElementPicker } from '@controllers/ElementPicker'
import { applyCommittedOutlines } from '@utils/outline'
import { describe, test, expect, beforeEach, vi, Mock } from 'vitest'

vi.mock('@controllers/ElementPicker')
vi.mock('@utils/outline')

describe('useElementPicker', () => {
  const mockOnElementPicked = vi.fn()
  const mockCleanup = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(ElementPicker as Mock).mockReturnValue(mockCleanup)
  })

  test('initializes with isActive false', () => {
    const { result } = renderHook(() =>
      useElementPicker({
        ruioEnabled: false,
        depth: 3,
        currentColorPalette: 'dynamic',
        onElementPicked: mockOnElementPicked,
      }),
    )

    expect(result.current.isActive).toBe(false)
  })

  test('toggle function changes isActive state', () => {
    const { result } = renderHook(() =>
      useElementPicker({
        ruioEnabled: false,
        depth: 3,
        currentColorPalette: 'dynamic',
        onElementPicked: mockOnElementPicked,
      }),
    )

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isActive).toBe(true)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isActive).toBe(false)
  })

  test('does not initialize controller when ruioEnabled is false', () => {
    renderHook(() =>
      useElementPicker({
        ruioEnabled: false,
        depth: 3,
        currentColorPalette: 'dynamic',
        onElementPicked: mockOnElementPicked,
      }),
    )

    expect(ElementPicker).not.toHaveBeenCalled()
  })

  test('does not initialize controller when isActive is false', () => {
    renderHook(() =>
      useElementPicker({
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'dynamic',
        onElementPicked: mockOnElementPicked,
      }),
    )

    expect(ElementPicker).not.toHaveBeenCalled()
  })

  test('initializes controller when both ruioEnabled and isActive are true', () => {
    const { result } = renderHook(() =>
      useElementPicker({
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'dynamic',
        onElementPicked: mockOnElementPicked,
      }),
    )

    act(() => {
      result.current.setIsActive(true)
    })

    expect(ElementPicker).toHaveBeenCalled()
  })

  test('calls cleanup when hook unmounts', () => {
    const { result, unmount } = renderHook(() =>
      useElementPicker({
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'dynamic',
        onElementPicked: mockOnElementPicked,
      }),
    )

    act(() => {
      result.current.setIsActive(true)
    })

    expect(ElementPicker).toHaveBeenCalled()

    unmount()

    expect(mockCleanup).toHaveBeenCalled()
  })

  test('calls cleanup when isActive changes to false', () => {
    const { result } = renderHook(() =>
      useElementPicker({
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'dynamic',
        onElementPicked: mockOnElementPicked,
      }),
    )

    act(() => {
      result.current.setIsActive(true)
    })

    expect(ElementPicker).toHaveBeenCalled()
    mockCleanup.mockClear()

    act(() => {
      result.current.setIsActive(false)
    })

    expect(mockCleanup).toHaveBeenCalled()
  })

  test('toggle function maintains referential equality', () => {
    const { result, rerender } = renderHook(() =>
      useElementPicker({
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'dynamic',
        onElementPicked: mockOnElementPicked,
      }),
    )

    const initialToggle = result.current.toggle

    rerender()

    expect(result.current.toggle).toBe(initialToggle)
  })
})
