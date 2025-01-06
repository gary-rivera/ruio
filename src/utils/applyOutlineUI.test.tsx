import { applyOutlineUI, resetPreviouslyAppliedElements } from './applyOutlineUI'

const defaultProps = {
  element: document.createElement('div'),
  depth: 2,
  apply: true,
  currentColorPalette: 'default',
}

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
      applyOutlineUI({ ...defaultProps })
    }).not.toThrow()
  })

  test('handles empty elements without throwing', () => {
    const emptyElement = document.createElement('div')
    expect(() => {
      applyOutlineUI({ ...defaultProps, element: emptyElement })
    }).not.toThrow()
  })

  test('does not fail on depth 0', () => {
    expect(() => {
      applyOutlineUI({ ...defaultProps, depth: 0 })
    }).not.toThrow()
  })

  test('does not fail when apply is false', () => {
    expect(() => {
      applyOutlineUI({ ...defaultProps, apply: false })
    }).not.toThrow()
  })

  // Functional Tests
  test('applies borders to the element and its children', () => {
    applyOutlineUI({ ...defaultProps, depth: 1 })

    expect(element.style.outline).toBe('2px solid #990000')
    expect(childElement.style.outline).toBe('2px solid #003366')
  })

  test('removes borders when apply is false', () => {
    applyOutlineUI({ ...defaultProps, depth: 1 })

    applyOutlineUI({ ...defaultProps, depth: 1, apply: false })

    expect(element.style.outline).toBe('')
    expect(childElement.style.outline).toBe('')
  })

  test('applies borders only up to the given depth', () => {
    const deepChildElement = document.createElement('div')
    childElement.appendChild(deepChildElement)

    applyOutlineUI({ ...defaultProps, depth: 1 })

    expect(element.style.outline).toBe('2px solid #990000')
    expect(childElement.style.outline).toBe('2px solid #003366')
    expect(deepChildElement.style.outline).toBe('')
  })

  test('removes border from previously applied elements not in the current list', () => {
    applyOutlineUI({ ...defaultProps, depth: 1 })
    expect(element.style.outline).toBe('2px solid #990000')

    applyOutlineUI({ ...defaultProps, depth: 1 })
    expect(element.style.outline).toBe('')
    expect(childElement.style.outline).toBe('2px solid #990000')
  })
})
