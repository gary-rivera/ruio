import { applyOutlineUI, resetPreviouslyAppliedElements } from './applyOutlineUI'

describe('applyOutlineUI Smoke and Functionality Tests', () => {
  let element: HTMLElement
  let childElement: HTMLElement
  let originalRequestAnimationFrame: typeof window.requestAnimationFrame

  beforeEach(() => {
    element = document.createElement('div')
    childElement = document.createElement('div')
    element.appendChild(childElement)

    // Save original requestAnimationFrame reference
    originalRequestAnimationFrame = window.requestAnimationFrame

    // Mock requestAnimationFrame to run synchronously and return a dummy number
    window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
      callback(0) // Execute the callback immediately
      return 1 // Return a mock frame ID
    }

    // Reset previously applied elements before each test
    resetPreviouslyAppliedElements()
  })

  afterEach(() => {
    // Restore the original requestAnimationFrame after each test
    window.requestAnimationFrame = originalRequestAnimationFrame
    element.style.outline = ''
    childElement.style.outline = ''
  })

  // Smoke Tests
  test('runs without errors on valid input', () => {
    expect(() => {
      applyOutlineUI(element, 2, true, 'default')
    }).not.toThrow()
  })

  test('handles empty elements without throwing', () => {
    const emptyElement = document.createElement('div')
    expect(() => {
      applyOutlineUI(emptyElement, 2, true, 'default')
    }).not.toThrow()
  })

  test('does not fail on depth 0', () => {
    expect(() => {
      applyOutlineUI(element, 0, true, 'default')
    }).not.toThrow()
  })

  test('does not fail when apply is false', () => {
    expect(() => {
      applyOutlineUI(element, 2, false, 'default')
    }).not.toThrow()
  })

  // Functional Tests
  test('applies borders to the element and its children', () => {
    applyOutlineUI(element, 1, true, 'default')
    expect(element.style.outline).toBe('2px solid #990000')
    expect(childElement.style.outline).toBe('2px solid #003366')
  })

  test('removes borders when apply is false', () => {
    applyOutlineUI(element, 1, true, 'default')
    applyOutlineUI(element, 1, false, 'default')

    expect(element.style.outline).toBe('')
    expect(childElement.style.outline).toBe('')
  })

  test('applies borders only up to the given depth', () => {
    const deepChildElement = document.createElement('div')
    childElement.appendChild(deepChildElement)

    applyOutlineUI(element, 1, true, 'default')

    expect(element.style.outline).toBe('2px solid #990000')
    expect(childElement.style.outline).toBe('2px solid #003366')
    expect(deepChildElement.style.outline).toBe('')
  })

  test('removes border from previously applied elements not in the current list', () => {
    applyOutlineUI(element, 1, true, 'default')
    expect(element.style.outline).toBe('2px solid #990000')

    applyOutlineUI(childElement, 1, true, 'default')
    expect(element.style.outline).toBe('')
    expect(childElement.style.outline).toBe('2px solid #990000')
  })
})
