import { ElementInteractionController } from './ElementInteractionController'

describe('ElementInteractionController', () => {
  let mockHoverCallback: jest.Mock
  let mockClickCallback: jest.Mock
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

    mockHoverCallback = jest.fn()
    mockClickCallback = jest.fn()

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

  test('applies no hover styles and does not call hover callback on excluded elements', () => {
    const hoverEvent = new MouseEvent('mouseover', {
      bubbles: true,
    })

    excludedElement.dispatchEvent(hoverEvent)

    expect(mockHoverCallback).not.toHaveBeenCalled()
    expect(excludedElement.style.backgroundColor).toBe('')
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
  test('ignores clicks and hovers on the root element itself', () => {
    const hoverEvent = new MouseEvent('mouseover', {
      bubbles: true,
    })
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
    })

    rootElement.dispatchEvent(hoverEvent)
    rootElement.dispatchEvent(clickEvent)

    expect(mockHoverCallback).not.toHaveBeenCalled()
    expect(mockClickCallback).not.toHaveBeenCalled()
    expect(rootElement.style.backgroundColor).toBe('')
  })

  // TODO: before implementing this test, we need to ensure the ElemntInteractionController is updated to handle this case
  // requires being more restrictive in the hover and click event listeners, namely our logic behind storing element styles in the originalStyles map section
  // test('restores element styles to their original state after selection mode is triggered', () => {
  //   const hoverEvent = new MouseEvent('mouseover', {
  //     bubbles: true,
  //   })
  //   const clickEvent = new MouseEvent('click', {
  //     bubbles: true,
  //   })

  //   // Dispatch hover event before click
  //   childElement.dispatchEvent(hoverEvent)
  //   expect(childElement.style.backgroundColor).toBe('rgba(153, 181, 214, 0.66)')

  //   // Dispatch click event to trigger selection mode and reset styles
  //   childElement.dispatchEvent(clickEvent)
  //   expect(childElement.style.backgroundColor).toBe('')

  //   // Ensure cleanup is called (listeners are removed)
  //   if (cleanup) cleanup()

  //   // Clear mocks and check for post-cleanup events
  //   mockHoverCallback.mockClear()
  //   mockClickCallback.mockClear()

  //   childElement.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  //   childElement.dispatchEvent(new MouseEvent('click', { bubbles: true }))

  //   expect(mockHoverCallback).not.toHaveBeenCalled()
  //   expect(mockClickCallback).not.toHaveBeenCalled()
  // })
})
