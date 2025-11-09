import {
  applyCommittedOutlines,
  resetCommittedOutlines,
  calculateMaxDepth,
  clearCommittedOutlines,
} from '@utils/outline'
import { describe, test, expect, beforeEach, afterEach } from 'vitest'

describe('applyCommittedOutlines Smoke and Functionality Tests', () => {
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
    resetCommittedOutlines()
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
      applyCommittedOutlines(element, 2, true, 'roygbiv')
    }).not.toThrow()
  })

  test('handles empty elements without throwing', () => {
    const emptyElement = document.createElement('div')
    expect(() => {
      applyCommittedOutlines(emptyElement, 2, true, 'roygbiv')
    }).not.toThrow()
  })

  test('does not fail on depth 0', () => {
    expect(() => {
      applyCommittedOutlines(element, 0, true, 'roygbiv')
    }).not.toThrow()
  })

  test('does not fail when apply is false', () => {
    expect(() => {
      applyCommittedOutlines(element, 2, false, 'roygbiv')
    }).not.toThrow()
  })

  // Functional Tests
  test('applies borders to the element and its children', () => {
    applyCommittedOutlines(element, 1, true, 'roygbiv')
    expect(element.style.outline).toBe('2px solid #CD001A')
    expect(childElement.style.outline).toBe('2px solid #EF6A00')
  })

  test('removes borders when apply is false', () => {
    applyCommittedOutlines(element, 1, true, 'roygbiv')
    applyCommittedOutlines(element, 1, false, 'roygbiv')

    expect(element.style.outline).toBe('')
    expect(childElement.style.outline).toBe('')
  })

  test('applies borders only up to the given depth', () => {
    const deepChildElement = document.createElement('div')
    childElement.appendChild(deepChildElement)

    applyCommittedOutlines(element, 1, true, 'roygbiv')

    expect(element.style.outline).toBe('2px solid #CD001A')
    expect(childElement.style.outline).toBe('2px solid #EF6A00')
    expect(deepChildElement.style.outline).toBe('')
  })

  test('removes border from previously applied elements not in the current list', () => {
    applyCommittedOutlines(element, 1, true, 'roygbiv')
    expect(element.style.outline).toBe('2px solid #CD001A')

    applyCommittedOutlines(childElement, 1, true, 'roygbiv')
    expect(element.style.outline).toBe('')
    expect(childElement.style.outline).toBe('2px solid #CD001A')
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

describe('clearCommittedOutlines', () => {
  let element: HTMLElement
  let childElement: HTMLElement
  let grandchildElement: HTMLElement
  let originalRequestAnimationFrame: typeof window.requestAnimationFrame

  beforeEach(() => {
    element = document.createElement('div')
    childElement = document.createElement('div')
    grandchildElement = document.createElement('div')
    element.appendChild(childElement)
    childElement.appendChild(grandchildElement)

    // Save original requestAnimationFrame reference
    originalRequestAnimationFrame = window.requestAnimationFrame

    // Mock requestAnimationFrame to run synchronously
    window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
      callback(0)
      return 1
    }

    // Reset previously applied elements before each test
    resetCommittedOutlines()
  })

  afterEach(() => {
    // Restore the original requestAnimationFrame after each test
    window.requestAnimationFrame = originalRequestAnimationFrame
    element.style.outline = ''
    element.style.outlineOffset = ''
    childElement.style.outline = ''
    childElement.style.outlineOffset = ''
    grandchildElement.style.outline = ''
    grandchildElement.style.outlineOffset = ''
  })

  test('clears all committed outlines from elements', () => {
    // Apply committed outlines
    applyCommittedOutlines(element, 2, true, 'roygbiv')

    // Verify outlines are applied
    expect(element.style.outline).toBe('2px solid #CD001A')
    expect(childElement.style.outline).toBe('2px solid #EF6A00')
    expect(grandchildElement.style.outline).toBe('2px solid #F2CD00')

    // Clear committed outlines
    clearCommittedOutlines()

    // Verify all outlines are removed
    expect(element.style.outline).toBe('')
    expect(childElement.style.outline).toBe('')
    expect(grandchildElement.style.outline).toBe('')
  })

  test('clears outlineOffset property', () => {
    // Apply committed outlines
    applyCommittedOutlines(element, 1, true, 'roygbiv')

    // Manually set outlineOffset (simulating what preview outlines might do)
    element.style.outlineOffset = '2px'
    childElement.style.outlineOffset = '2px'

    // Clear committed outlines
    clearCommittedOutlines()

    // Verify outlineOffset is also cleared
    expect(element.style.outlineOffset).toBe('')
    expect(childElement.style.outlineOffset).toBe('')
  })

  test('handles being called when no outlines are applied', () => {
    // Should not throw when called with no committed outlines
    expect(() => {
      clearCommittedOutlines()
    }).not.toThrow()
  })

  test('clears internal tracking of committed elements', () => {
    // Apply committed outlines to first element
    applyCommittedOutlines(element, 1, true, 'roygbiv')
    expect(element.style.outline).toBe('2px solid #CD001A')

    // Clear all committed outlines
    clearCommittedOutlines()

    // Apply new committed outlines to a different element
    applyCommittedOutlines(childElement, 1, true, 'roygbiv')

    // Original element should not have outlines (proves internal tracking was cleared)
    expect(element.style.outline).toBe('')
    expect(childElement.style.outline).toBe('2px solid #CD001A')
  })

  test('can be called multiple times without errors', () => {
    applyCommittedOutlines(element, 1, true, 'roygbiv')

    expect(() => {
      clearCommittedOutlines()
      clearCommittedOutlines()
      clearCommittedOutlines()
    }).not.toThrow()

    expect(element.style.outline).toBe('')
    expect(childElement.style.outline).toBe('')
  })
})
