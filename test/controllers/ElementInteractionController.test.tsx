import { ElementInteractionController } from '@controllers/ElementInteractionController'
import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest'

describe('ElementInteractionController', () => {
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

    cleanup = ElementInteractionController(mockHoverCallback, mockClickCallback)
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
      ElementInteractionController(mockHoverCallback, mockClickCallback)
    }).not.toThrow()
  })

  test('returns a cleanup function or undefined', () => {
    expect(typeof cleanup === 'function' || cleanup === undefined).toBe(true)
  })

  /**
   * Functional Tests
   */
  test('applies hover styles and calls hover callback on hover over a valid target', () => {
    const hoverEvent = new MouseEvent('mouseover', {
      bubbles: true,
    })
    childElement.dispatchEvent(hoverEvent)

    expect(mockHoverCallback).toHaveBeenCalledWith(childElement)
    expect(childElement.style.backgroundColor).toBe('rgba(153, 181, 214, 0.66)')
  })

  test('removes hover styles when mouse leaves valid target', () => {
    const originalBgColor = childElement.style.backgroundColor
    const mouseOnEvent = new MouseEvent('mouseover', {
      bubbles: true,
    })
    const mouseOutEvent = new MouseEvent('mouseout', {
      bubbles: true,
      relatedTarget: null, // Simulate moving out of the element completely
    })

    childElement.dispatchEvent(mouseOnEvent)
    expect(childElement.classList.contains('ruio-hovered')).toBe(true)

    childElement.dispatchEvent(mouseOutEvent)
    expect(childElement.classList.contains('ruio-hovered')).toBe(false)
    expect(childElement.style.backgroundColor).toBe(originalBgColor)
  })

  test('calls click callback and cleans up listeners on click', () => {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
    })

    childElement.dispatchEvent(clickEvent)

    expect(mockClickCallback).toHaveBeenCalledWith(childElement)
    expect(childElement.style.backgroundColor).toBe('')

    // Ensure cleanup is called (listeners are removed)
    if (cleanup) cleanup()

    // Try triggering hover/click after cleanup to ensure no effect
    mockClickCallback.mockClear() // Reset the callback to check for post-cleanup events
    childElement.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    childElement.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(mockClickCallback).not.toHaveBeenCalled()
  })

  /**
   * Edge Case Tests
   */
  test('restores element styles to their original state after selection mode is triggered', () => {
    const hoverEvent = new MouseEvent('mouseover', {
      bubbles: true,
    })
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
    })

    // Verify initial background color is white (set in beforeEach)
    expect(childElement.style.backgroundColor).toBe('white')

    // Dispatch hover event before click
    childElement.dispatchEvent(hoverEvent)
    expect(childElement.style.backgroundColor).toBe('rgba(153, 181, 214, 0.66)')

    // Dispatch click event to trigger selection mode and reset styles
    childElement.dispatchEvent(clickEvent)
    // After click, the original background color should be restored
    expect(childElement.style.backgroundColor).toBe('white')

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

  test('correctly preserves and restores multiple inline styles', () => {
    // Set up element with multiple inline styles
    const testElement = document.createElement('div')
    testElement.style.backgroundColor = 'red'
    testElement.style.color = 'blue'
    testElement.style.fontSize = '16px'
    testElement.style.padding = '10px'
    rootElement.appendChild(testElement)

    const originalBgColor = testElement.style.backgroundColor
    const originalColor = testElement.style.color
    const originalFontSize = testElement.style.fontSize
    const originalPadding = testElement.style.padding

    // Hover over the element
    const hoverEvent = new MouseEvent('mouseover', { bubbles: true })
    testElement.dispatchEvent(hoverEvent)

    // Verify hover style is applied
    expect(testElement.style.backgroundColor).toBe('rgba(153, 181, 214, 0.66)')
    // Other styles should remain unchanged
    expect(testElement.style.color).toBe(originalColor)
    expect(testElement.style.fontSize).toBe(originalFontSize)
    expect(testElement.style.padding).toBe(originalPadding)

    // Mouse out
    const mouseOutEvent = new MouseEvent('mouseout', { bubbles: true })
    testElement.dispatchEvent(mouseOutEvent)

    // Verify all original styles are restored
    expect(testElement.style.backgroundColor).toBe(originalBgColor)
    expect(testElement.style.color).toBe(originalColor)
    expect(testElement.style.fontSize).toBe(originalFontSize)
    expect(testElement.style.padding).toBe(originalPadding)

    rootElement.removeChild(testElement)
  })

  test('handles elements with no initial inline styles', () => {
    // Create element with no inline styles
    const noStyleElement = document.createElement('div')
    rootElement.appendChild(noStyleElement)

    expect(noStyleElement.getAttribute('style')).toBeNull()

    // Hover over the element
    const hoverEvent = new MouseEvent('mouseover', { bubbles: true })
    noStyleElement.dispatchEvent(hoverEvent)

    // Verify hover style is applied
    expect(noStyleElement.style.backgroundColor).toBe('rgba(153, 181, 214, 0.66)')

    // Mouse out
    const mouseOutEvent = new MouseEvent('mouseout', { bubbles: true })
    noStyleElement.dispatchEvent(mouseOutEvent)

    // Verify style attribute is removed (not just emptied)
    expect(noStyleElement.getAttribute('style')).toBeNull()

    rootElement.removeChild(noStyleElement)
  })
})
