import { ElementInteractionController } from './ElementInteractionController'

describe('ElementInteractionController', () => {
  let mockCallback: jest.Mock
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
    excludedElement.classList.add('ruio-exclude')
    rootElement.appendChild(excludedElement)

    mockCallback = jest.fn()

    cleanup = ElementInteractionController(mockCallback)
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
      ElementInteractionController(mockCallback)
    }).not.toThrow()
  })

  test('returns a cleanup function or undefined', () => {
    expect(typeof cleanup === 'function' || cleanup === undefined).toBe(true)
  })

  /**
   * Functional Tests
   */
  test('applies hover styles and calls callback on hover over a valid target', () => {
    const hoverEvent = new MouseEvent('mouseover', {
      bubbles: true,
    })
    childElement.dispatchEvent(hoverEvent)

    expect(mockCallback).toHaveBeenCalledWith(childElement)
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

  test('applies no hover styles and does not call callback on excluded elements', () => {
    const hoverEvent = new MouseEvent('mouseover', {
      bubbles: true,
    })

    excludedElement.dispatchEvent(hoverEvent)

    expect(mockCallback).not.toHaveBeenCalled()
    expect(excludedElement.style.outline).toBe('')
    expect(excludedElement.style.backgroundColor).toBe('')
  })

  test('calls callback and cleans up listeners on click', () => {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
    })

    childElement.dispatchEvent(clickEvent)

    expect(mockCallback).toHaveBeenCalledWith(childElement)
    expect(childElement.style.outline).toBe('')
    expect(childElement.style.backgroundColor).toBe('')

    // Ensure cleanup is called (listeners are removed)
    if (cleanup) cleanup()

    // Try triggering hover/click after cleanup to ensure no effect
    mockCallback.mockClear() // Reset the callback to check for post-cleanup events
    childElement.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    childElement.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(mockCallback).not.toHaveBeenCalled()
  })

  /**
   * Edge Case Tests
   */
  test('ignores clicks and hovers on the root element itself', () => {
    const hoverEvent = new MouseEvent('mouseover', {
      bubbles: true,
    })
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
    })

    rootElement.dispatchEvent(hoverEvent)
    rootElement.dispatchEvent(clickEvent)

    expect(mockCallback).not.toHaveBeenCalled()
    expect(rootElement.style.outline).toBe('')
    expect(rootElement.style.backgroundColor).toBe('')
  })

  // test('applies hover styles to child elements of root, not root itself', () => {
  //   const hoverEvent = new MouseEvent('mouseover', {
  //     bubbles: true,
  //   })

  //   childElement.dispatchEvent(hoverEvent)

  //   expect(childElement.style.outline).toBe('2px dashed blue')
  //   expect(rootElement.style.outline).toBe('')
  // })
})

// TODO: test to ensure the file looks the EXACT same as before the SelectElementMode is triggered
