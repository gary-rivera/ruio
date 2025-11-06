import { renderHook, act } from '@testing-library/react'
import { useLocalStorageState } from '@hooks/useLocalStorageState'
import { describe, test, expect, beforeEach } from 'vitest'

describe('useLocalStorageState', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('initializes with default values when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorageState())

    expect(result.current.ruioEnabled).toBe(false)
    expect(result.current.rootSelector).toBe('')
  })

  test('initializes with values from localStorage', () => {
    localStorage.setItem('ruioEnabled', 'true')
    localStorage.setItem('rootElementSelector', '#app')

    const { result } = renderHook(() => useLocalStorageState())

    expect(result.current.ruioEnabled).toBe(true)
    expect(result.current.rootSelector).toBe('#app')
  })

  test('persists ruioEnabled to localStorage when changed', () => {
    const { result } = renderHook(() => useLocalStorageState())

    act(() => {
      result.current.setRuioEnabled(true)
    })

    expect(result.current.ruioEnabled).toBe(true)
    expect(localStorage.getItem('ruioEnabled')).toBe('true')
  })

  test('persists rootSelector to localStorage when changed', () => {
    const { result } = renderHook(() => useLocalStorageState())

    act(() => {
      result.current.setRootSelector('#my-root')
    })

    expect(result.current.rootSelector).toBe('#my-root')
    expect(localStorage.getItem('rootElementSelector')).toBe('#my-root')
  })

  test('updates ruioEnabled using function callback', () => {
    const { result } = renderHook(() => useLocalStorageState())

    act(() => {
      result.current.setRuioEnabled(true)
    })

    act(() => {
      result.current.setRuioEnabled((prev) => !prev)
    })

    expect(result.current.ruioEnabled).toBe(false)
    expect(localStorage.getItem('ruioEnabled')).toBe('false')
  })

  test('updates rootSelector using function callback', () => {
    const { result } = renderHook(() => useLocalStorageState())

    act(() => {
      result.current.setRootSelector('#initial')
    })

    act(() => {
      result.current.setRootSelector((prev) => prev + '-modified')
    })

    expect(result.current.rootSelector).toBe('#initial-modified')
    expect(localStorage.getItem('rootElementSelector')).toBe('#initial-modified')
  })

  test('maintains referential equality of setters across renders', () => {
    const { result, rerender } = renderHook(() => useLocalStorageState())

    const initialSetRuioEnabled = result.current.setRuioEnabled
    const initialSetRootSelector = result.current.setRootSelector

    rerender()

    expect(result.current.setRuioEnabled).toBe(initialSetRuioEnabled)
    expect(result.current.setRootSelector).toBe(initialSetRootSelector)
  })
})
