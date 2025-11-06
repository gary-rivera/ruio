import { debounce } from '@utils/debounce'
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  test('delays function execution', () => {
    const callback = vi.fn()
    const debounced = debounce(callback, 200)

    debounced()
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(199)
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('cancels previous calls when invoked multiple times', () => {
    const callback = vi.fn()
    const debounced = debounce(callback, 200)

    debounced()
    vi.advanceTimersByTime(100)
    debounced()
    vi.advanceTimersByTime(100)
    debounced()

    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(200)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('passes arguments to the callback', () => {
    const callback = vi.fn()
    const debounced = debounce(callback, 100)

    debounced('arg1', 42, { key: 'value' })
    vi.advanceTimersByTime(100)

    expect(callback).toHaveBeenCalledWith('arg1', 42, { key: 'value' })
  })

  test('uses latest arguments when called multiple times', () => {
    const callback = vi.fn()
    const debounced = debounce(callback, 100)

    debounced('first')
    debounced('second')
    debounced('third')

    vi.advanceTimersByTime(100)

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('third')
  })

  test('works with zero delay', () => {
    const callback = vi.fn()
    const debounced = debounce(callback, 0)

    debounced()
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(0)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
