import { ElementPicker } from '@controllers/ElementPicker'
import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest'

describe('ElementPicker', () => {
  let mockHoverCallback: ReturnType<typeof vi.fn>
  let mockClickCallback: ReturnType<typeof vi.fn>
  let rootElement: HTMLElement
  let childElement: HTMLElement
  let excludedElement: HTMLElement
  let cleanup: Function | undefined

  beforeEach(() => {
    rootElement = document.createElement('div')
    rootElement.id = 'root'
    document.body.appendChild(rootElement)

    childElement = document.createElement('div')
    childElement.style.backgroundColor = 'white'
    rootElement.appendChild(childElement)

    excludedElement = document.createElement('div')
    rootElement.appendChild(excludedElement)

    mockHoverCallback = vi.fn()
    mockClickCallback = vi.fn()

    cleanup = ElementPicker(mockClickCallback, mockHoverCallback, undefined)
  })

  afterEach(() => {
    // Remove root element from the DOM
    document.body.removeChild(rootElement)

    // Cleanup listeners and any residual styles
    if (cleanup) cleanup()
  })

  /**
   * Smoke Tests
   */
  test('runs without errors when called with a valid callback', () => {
    expect(() => {
      ElementPicker(mockClickCallback, mockHoverCallback, undefined)
    }).not.toThrow()
  })

  test('returns a cleanup function or undefined', () => {
    expect(typeof cleanup === 'function' || cleanup === undefined).toBe(true)
  })

  /**
   * Functional Tests
   */
  test('calls hover callback on hover over a valid target', () => {
    const hoverEvent = new MouseEvent('mouseover', {
      bubbles: true,
    })
    childElement.dispatchEvent(hoverEvent)

    expect(mockHoverCallback).toHaveBeenCalledWith(childElement, 0, 0)
  })

  test('calls mouseout callback when mouse leaves valid target', () => {
    const mockMouseOutCallback = vi.fn()
    const cleanupWithMouseOut = ElementPicker(mockClickCallback, mockHoverCallback, mockMouseOutCallback)

    const mouseOnEvent = new MouseEvent('mouseover', {
      bubbles: true,
    })
    const mouseOutEvent = new MouseEvent('mouseout', {
      bubbles: true,
      relatedTarget: null,
    })

    childElement.dispatchEvent(mouseOnEvent)
    childElement.dispatchEvent(mouseOutEvent)

    expect(mockMouseOutCallback).toHaveBeenCalled()

    cleanupWithMouseOut?.()
  })

  test('calls click callback and cleans up listeners on click', () => {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
    })

    childElement.dispatchEvent(clickEvent)

    expect(mockClickCallback).toHaveBeenCalledWith(childElement)

    // Ensure cleanup is called (listeners are removed)
    if (cleanup) cleanup()

    // Try triggering hover/click after cleanup to ensure no effect
    mockClickCallback.mockClear()
    childElement.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    childElement.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(mockClickCallback).not.toHaveBeenCalled()
  })

  /**
   * Edge Case Tests
   */
  test('cleanup removes all event listeners', () => {
    const hoverEvent = new MouseEvent('mouseover', {
      bubbles: true,
    })
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
    })

    // Verify callbacks work before cleanup
    childElement.dispatchEvent(hoverEvent)
    expect(mockHoverCallback).toHaveBeenCalled()

    // Ensure cleanup is called (listeners are removed)
    if (cleanup) cleanup()

    // Clear mocks and check for post-cleanup events
    mockHoverCallback.mockClear()
    mockClickCallback.mockClear()

    childElement.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    childElement.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(mockHoverCallback).not.toHaveBeenCalled()
    expect(mockClickCallback).not.toHaveBeenCalled()
  })

  test('does not apply styles directly - delegates to callbacks', () => {
    // Set up element with inline styles
    const testElement = document.createElement('div')
    testElement.style.backgroundColor = 'red'
    testElement.style.color = 'blue'
    rootElement.appendChild(testElement)

    const originalBgColor = testElement.style.backgroundColor
    const originalColor = testElement.style.color

    // Hover over the element
    const hoverEvent = new MouseEvent('mouseover', { bubbles: true })
    testElement.dispatchEvent(hoverEvent)

    // ElementPicker should NOT modify styles - that's the callback's job
    expect(testElement.style.backgroundColor).toBe(originalBgColor)
    expect(testElement.style.color).toBe(originalColor)

    // But it should call the callback
    expect(mockHoverCallback).toHaveBeenCalledWith(testElement, 0, 0)

    rootElement.removeChild(testElement)
  })

  test('filters out ruio UI elements', () => {
    const ruioElement = document.createElement('div')
    ruioElement.id = 'ruio-exclude-modal'
    rootElement.appendChild(ruioElement)

    const hoverEvent = new MouseEvent('mouseover', { bubbles: true })
    ruioElement.dispatchEvent(hoverEvent)

    // Should not call hover callback for ruio elements
    expect(mockHoverCallback).not.toHaveBeenCalled()

    rootElement.removeChild(ruioElement)
  })
})
