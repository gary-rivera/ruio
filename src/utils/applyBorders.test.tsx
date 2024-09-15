import { applyBorders, resetPreviouslyAppliedElements } from './applyBorders'

describe('applyBorders Smoke and Functionality Tests', () => {
  let element: HTMLElement
  let childElement: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
    childElement = document.createElement('div')
    element.appendChild(childElement)

    // Reset previously applied elements before each test
    resetPreviouslyAppliedElements()
  })

  afterEach(() => {
    element.style.outline = ''
    childElement.style.outline = ''
  })

  // Smoke Tests
  test('runs without errors on valid input', () => {
    expect(() => {
      applyBorders(element, 2, true)
    }).not.toThrow()
  })

  test('handles empty elements without throwing', () => {
    const emptyElement = document.createElement('div')
    expect(() => {
      applyBorders(emptyElement, 2, true)
    }).not.toThrow()
  })

  test('does not fail on depth 0', () => {
    expect(() => {
      applyBorders(element, 0, true)
    }).not.toThrow()
  })

  test('does not fail when apply is false', () => {
    expect(() => {
      applyBorders(element, 2, false)
    }).not.toThrow()
  })

  // Functional Tests
  test('applies borders to the element and its children', () => {
    applyBorders(element, 1, true)

    expect(element.style.outline).toBe('2px solid red')
    expect(childElement.style.outline).toBe('2px solid red')
  })

  test('removes borders when apply is false', () => {
    applyBorders(element, 1, true)
    applyBorders(element, 1, false)

    expect(element.style.outline).toBe('')
    expect(childElement.style.outline).toBe('')
  })

  test('applies borders only up to the given depth', () => {
    const deepChildElement = document.createElement('div')
    childElement.appendChild(deepChildElement)

    applyBorders(element, 1, true)

    expect(element.style.outline).toBe('2px solid red')
    expect(childElement.style.outline).toBe('2px solid red')
    expect(deepChildElement.style.outline).toBe('')
  })

  test('removes border from previously applied elements not in the current list', () => {
    applyBorders(element, 1, true)
    expect(element.style.outline).toBe('2px solid red')

    applyBorders(childElement, 1, true)
    expect(element.style.outline).toBe('')
    expect(childElement.style.outline).toBe('2px solid red')
  })
})
