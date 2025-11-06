import { renderHook, act } from '@testing-library/react'
import { useElementSelection } from '@hooks/useElementSelection'
import { ElementInteractionController } from '@controllers/ElementInteractionController'
import { applyOutlineUI } from '@utils/applyOutlineUI'
import { describe, test, expect, beforeEach, vi, Mock } from 'vitest'

vi.mock('@controllers/ElementInteractionController')
vi.mock('@utils/applyOutlineUI')

describe('useElementSelection', () => {
  const mockOnElementSelected = vi.fn()
  const mockCleanup = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(ElementInteractionController as Mock).mockReturnValue(mockCleanup)
  })

  test('initializes with isActive false', () => {
    const { result } = renderHook(() =>
      useElementSelection({
        ruioEnabled: false,
        depth: 3,
        currentColorPalette: 'default',
        onElementSelected: mockOnElementSelected,
      }),
    )

    expect(result.current.isActive).toBe(false)
  })

  test('toggle function changes isActive state', () => {
    const { result } = renderHook(() =>
      useElementSelection({
        ruioEnabled: false,
        depth: 3,
        currentColorPalette: 'default',
        onElementSelected: mockOnElementSelected,
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
      useElementSelection({
        ruioEnabled: false,
        depth: 3,
        currentColorPalette: 'default',
        onElementSelected: mockOnElementSelected,
      }),
    )

    expect(ElementInteractionController).not.toHaveBeenCalled()
  })

  test('does not initialize controller when isActive is false', () => {
    renderHook(() =>
      useElementSelection({
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'default',
        onElementSelected: mockOnElementSelected,
      }),
    )

    expect(ElementInteractionController).not.toHaveBeenCalled()
  })

  test('initializes controller when both ruioEnabled and isActive are true', () => {
    const { result } = renderHook(() =>
      useElementSelection({
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'default',
        onElementSelected: mockOnElementSelected,
      }),
    )

    act(() => {
      result.current.setIsActive(true)
    })

    expect(ElementInteractionController).toHaveBeenCalled()
  })

  test('calls cleanup when hook unmounts', () => {
    const { result, unmount } = renderHook(() =>
      useElementSelection({
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'default',
        onElementSelected: mockOnElementSelected,
      }),
    )

    act(() => {
      result.current.setIsActive(true)
    })

    expect(ElementInteractionController).toHaveBeenCalled()

    unmount()

    expect(mockCleanup).toHaveBeenCalled()
  })

  test('calls cleanup when isActive changes to false', () => {
    const { result } = renderHook(() =>
      useElementSelection({
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'default',
        onElementSelected: mockOnElementSelected,
      }),
    )

    act(() => {
      result.current.setIsActive(true)
    })

    expect(ElementInteractionController).toHaveBeenCalled()
    mockCleanup.mockClear()

    act(() => {
      result.current.setIsActive(false)
    })

    expect(mockCleanup).toHaveBeenCalled()
  })

  test('toggle function maintains referential equality', () => {
    const { result, rerender } = renderHook(() =>
      useElementSelection({
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'default',
        onElementSelected: mockOnElementSelected,
      }),
    )

    const initialToggle = result.current.toggle

    rerender()

    expect(result.current.toggle).toBe(initialToggle)
  })
})
