import { applyOutlineUI, resetPreviouslyAppliedElements, calculateMaxDepth } from '@utils/outline'
import { describe, test, expect, beforeEach, afterEach } from 'vitest'

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
    expect(element.style.outline).toBe('2px solid #249EA0')
    expect(childElement.style.outline).toBe('2px solid #FAAB36')
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

    expect(element.style.outline).toBe('2px solid #249EA0')
    expect(childElement.style.outline).toBe('2px solid #FAAB36')
    expect(deepChildElement.style.outline).toBe('')
  })

  test('removes border from previously applied elements not in the current list', () => {
    applyOutlineUI(element, 1, true, 'default')
    expect(element.style.outline).toBe('2px solid #249EA0')

    applyOutlineUI(childElement, 1, true, 'default')
    expect(element.style.outline).toBe('')
    expect(childElement.style.outline).toBe('2px solid #249EA0')
  })
})

describe('calculateMaxDepth', () => {
  test('returns 0 for null element', () => {
    expect(calculateMaxDepth(null)).toBe(0)
  })

  test('returns 0 for element with no children', () => {
    const element = document.createElement('div')
    expect(calculateMaxDepth(element)).toBe(0)
  })

  test('returns 1 for element with one level of children', () => {
    const parent = document.createElement('div')
    const child = document.createElement('div')
    parent.appendChild(child)
    expect(calculateMaxDepth(parent)).toBe(1)
  })

  test('calculates correct depth for nested elements', () => {
    const root = document.createElement('div')
    const level1 = document.createElement('div')
    const level2 = document.createElement('div')
    const level3 = document.createElement('div')

    root.appendChild(level1)
    level1.appendChild(level2)
    level2.appendChild(level3)

    expect(calculateMaxDepth(root)).toBe(3)
  })

  test('finds maximum depth when multiple branches exist', () => {
    const root = document.createElement('div')
    const branch1 = document.createElement('div')
    const branch2 = document.createElement('div')
    const deepChild = document.createElement('div')

    root.appendChild(branch1)
    root.appendChild(branch2)
    branch2.appendChild(deepChild)

    expect(calculateMaxDepth(root)).toBe(2)
  })

  test('ignores script tags in depth calculation', () => {
    const root = document.createElement('div')
    const child = document.createElement('div')
    const script = document.createElement('script')

    root.appendChild(child)
    child.appendChild(script)

    expect(calculateMaxDepth(root)).toBe(1)
  })

  test('handles deeply nested structure', () => {
    const root = document.createElement('div')
    let current = root

    // Create 10 levels deep
    for (let i = 0; i < 10; i++) {
      const child = document.createElement('div')
      current.appendChild(child)
      current = child
    }

    expect(calculateMaxDepth(root)).toBe(10)
  })

  test('handles mixed element types', () => {
    const root = document.createElement('div')
    const span = document.createElement('span')
    const p = document.createElement('p')
    const div = document.createElement('div')

    root.appendChild(span)
    span.appendChild(p)
    p.appendChild(div)

    expect(calculateMaxDepth(root)).toBe(3)
  })
})
