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
    const config = {
      ruioEnabled: true,
      depth: 5,
      currentColorPalette: 'neon',
      rootElementSelector: '#app',
    }
    localStorage.setItem('ruio-config', JSON.stringify(config))

    const { result } = renderHook(() => useLocalStorageState())

    expect(result.current.ruioEnabled).toBe(true)
    expect(result.current.rootSelector).toBe('#app')
    expect(result.current.depth).toBe(5)
    expect(result.current.currentColorPalette).toBe('neon')
  })

  test('persists ruioEnabled to localStorage when changed', () => {
    const { result } = renderHook(() => useLocalStorageState())

    act(() => {
      result.current.setRuioEnabled(true)
    })

    expect(result.current.ruioEnabled).toBe(true)

    const stored = JSON.parse(localStorage.getItem('ruio-config') || '{}')
    expect(stored.ruioEnabled).toBe(true)
  })

  test('persists rootSelector to localStorage when changed', () => {
    const { result } = renderHook(() => useLocalStorageState())

    act(() => {
      result.current.setRootSelector('#my-root')
    })

    expect(result.current.rootSelector).toBe('#my-root')

    const stored = JSON.parse(localStorage.getItem('ruio-config') || '{}')
    expect(stored.rootElementSelector).toBe('#my-root')
  })

  test('persists depth to localStorage when changed', () => {
    const { result } = renderHook(() => useLocalStorageState())

    act(() => {
      result.current.setDepth(10)
    })

    expect(result.current.depth).toBe(10)

    const stored = JSON.parse(localStorage.getItem('ruio-config') || '{}')
    expect(stored.depth).toBe(10)
  })

  test('persists currentColorPalette to localStorage when changed', () => {
    const { result } = renderHook(() => useLocalStorageState())

    act(() => {
      result.current.setCurrentColorPalette('dynamic')
    })

    expect(result.current.currentColorPalette).toBe('dynamic')

    const stored = JSON.parse(localStorage.getItem('ruio-config') || '{}')
    expect(stored.currentColorPalette).toBe('dynamic')
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

    const stored = JSON.parse(localStorage.getItem('ruio-config') || '{}')
    expect(stored.ruioEnabled).toBe(false)
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

    const stored = JSON.parse(localStorage.getItem('ruio-config') || '{}')
    expect(stored.rootElementSelector).toBe('#initial-modified')
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
