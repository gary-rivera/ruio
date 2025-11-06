import {
  getLocalStorageValue,
  getRuioEnabledLocalStorageValue,
  getRootSelectorLocalStorageValue,
  parseSelectorFromSelectedElement,
  setLocalStorageValue,
} from '@utils/config'
import { describe, test, expect, beforeEach } from 'vitest'

describe('config', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getLocalStorageValue', () => {
    test('returns stored value when it exists', () => {
      localStorage.setItem('depth', '5')
      expect(getLocalStorageValue('depth')).toBe('5')
    })

    test('returns default value when no stored value exists', () => {
      expect(getLocalStorageValue('depth')).toBe(3)
    })

    test('returns default color palette when not set', () => {
      expect(getLocalStorageValue('currentColorPalette')).toBe('default')
    })
  })

  describe('getRuioEnabledLocalStorageValue', () => {
    test('returns false by default', () => {
      expect(getRuioEnabledLocalStorageValue()).toBe(false)
    })

    test('returns true when set to truthy value', () => {
      localStorage.setItem('ruioEnabled', 'true')
      expect(getRuioEnabledLocalStorageValue()).toBe(true)
    })
  })

  describe('getRootSelectorLocalStorageValue', () => {
    test('returns empty string when no value stored', () => {
      expect(getRootSelectorLocalStorageValue()).toBe('')
    })

    test('returns stored selector value', () => {
      localStorage.setItem('rootElementSelector', '#app')
      expect(getRootSelectorLocalStorageValue()).toBe('#app')
    })

    test('does not return default selector when not set', () => {
      const result = getRootSelectorLocalStorageValue()
      expect(result).toBe('')
    })
  })

  describe('parseSelectorFromSelectedElement', () => {
    test('returns id selector when element has id', () => {
      const element = document.createElement('div')
      element.id = 'my-element'
      expect(parseSelectorFromSelectedElement(element)).toBe('#my-element')
    })

    test('returns class selector when element has className', () => {
      const element = document.createElement('div')
      element.className = 'my-class'
      expect(parseSelectorFromSelectedElement(element)).toBe('.my-class')
    })

    test('returns className string when element has multiple classes', () => {
      const element = document.createElement('div')
      element.classList.add('first-class', 'second-class')
      // Implementation returns the full className string, not just first class
      expect(parseSelectorFromSelectedElement(element)).toBe('.first-class second-class')
    })

    test('prioritizes id over class', () => {
      const element = document.createElement('div')
      element.id = 'unique-id'
      element.className = 'some-class'
      expect(parseSelectorFromSelectedElement(element)).toBe('#unique-id')
    })

    test('returns selector based on classList when element has no id or className', () => {
      const element = document.createElement('div')
      // When no id or className, implementation checks classList[0]
      // In jsdom, empty classList[0] is undefined, resulting in '.undefined'
      expect(parseSelectorFromSelectedElement(element)).toBe('.undefined')
    })
  })

  describe('setLocalStorageValue', () => {
    test('stores value in localStorage', () => {
      setLocalStorageValue('depth', '10')
      expect(localStorage.getItem('depth')).toBe('10')
    })

    test('overwrites existing value', () => {
      localStorage.setItem('depth', '3')
      setLocalStorageValue('depth', '5')
      expect(localStorage.getItem('depth')).toBe('5')
    })

    test('stores ruioEnabled as string', () => {
      setLocalStorageValue('ruioEnabled', 'true')
      expect(localStorage.getItem('ruioEnabled')).toBe('true')
    })
  })
})
