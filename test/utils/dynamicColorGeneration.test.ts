import { describe, test, expect, beforeEach } from 'vitest'
import {
  getComputedBackgroundColor,
  getRelativeLuminance,
  generateContrastingColor,
} from '@utils/dynamicColorGeneration'

describe('dynamicColorGeneration', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('getComputedBackgroundColor', () => {
    test('returns element background when set', () => {
      const element = document.createElement('div')
      element.style.backgroundColor = 'rgb(255, 0, 0)'
      document.body.appendChild(element)

      const color = getComputedBackgroundColor(element)
      expect(color).toEqual({ r: 255, g: 0, b: 0 })
    })

    test('traverses to parent when element has transparent background', () => {
      const parent = document.createElement('div')
      parent.style.backgroundColor = 'rgb(0, 255, 0)'
      const element = document.createElement('div')
      element.style.backgroundColor = 'transparent'
      parent.appendChild(element)
      document.body.appendChild(parent)

      const color = getComputedBackgroundColor(element)
      expect(color).toEqual({ r: 0, g: 255, b: 0 })
    })

    test('returns white as default when no background found', () => {
      const element = document.createElement('div')
      document.body.appendChild(element)

      const color = getComputedBackgroundColor(element)
      expect(color).toEqual({ r: 255, g: 255, b: 255 })
    })
  })

  describe('getRelativeLuminance', () => {
    test('calculates luminance for white', () => {
      const luminance = getRelativeLuminance({ r: 255, g: 255, b: 255 })
      expect(luminance).toBe(1)
    })

    test('calculates luminance for black', () => {
      const luminance = getRelativeLuminance({ r: 0, g: 0, b: 0 })
      expect(luminance).toBe(0)
    })

    test('calculates luminance for red', () => {
      const luminance = getRelativeLuminance({ r: 255, g: 0, b: 0 })
      expect(luminance).toBeGreaterThan(0)
      expect(luminance).toBeLessThan(1)
    })
  })

  describe('generateContrastingColor', () => {
    test('generates a color for element on light background', () => {
      const element = document.createElement('div')
      element.style.backgroundColor = 'rgb(250, 250, 250)'
      document.body.appendChild(element)

      const color = generateContrastingColor(element, 0)
      expect(color).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/)
    })

    test('generates a color for element on dark background', () => {
      const element = document.createElement('div')
      element.style.backgroundColor = 'rgb(20, 20, 20)'
      document.body.appendChild(element)

      const color = generateContrastingColor(element, 0)
      expect(color).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/)
    })

    test('generates different colors for different depths', () => {
      const element = document.createElement('div')
      element.style.backgroundColor = 'rgb(255, 255, 255)'
      document.body.appendChild(element)

      const color0 = generateContrastingColor(element, 0)
      const color1 = generateContrastingColor(element, 1)
      const color2 = generateContrastingColor(element, 2)

      expect(color0).not.toBe(color1)
      expect(color1).not.toBe(color2)
    })

    test('generates valid HSL format', () => {
      const element = document.createElement('div')
      document.body.appendChild(element)

      const color = generateContrastingColor(element, 0)
      const match = color.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/)

      expect(match).not.toBeNull()
      if (match) {
        const [, h, s, l] = match
        expect(parseInt(h)).toBeGreaterThanOrEqual(0)
        expect(parseInt(h)).toBeLessThanOrEqual(360)
        expect(parseInt(s)).toBeGreaterThanOrEqual(0)
        expect(parseInt(s)).toBeLessThanOrEqual(100)
        expect(parseInt(l)).toBeGreaterThanOrEqual(0)
        expect(parseInt(l)).toBeLessThanOrEqual(100)
      }
    })
  })
})
