import { colorPalettesMap, getRelativeDepthColor } from '@utils/colorPalettes'
import { describe, test, expect } from 'vitest'

describe('colorPalettes', () => {
  describe('colorPalettesMap', () => {
    test('contains expected palette keys', () => {
      expect(colorPalettesMap).toHaveProperty('default')
      expect(colorPalettesMap).toHaveProperty('roygbiv')
      expect(colorPalettesMap).toHaveProperty('neon')
      expect(colorPalettesMap).toHaveProperty('minima')
    })

    test('each palette has at least one color', () => {
      Object.values(colorPalettesMap).forEach((palette) => {
        expect(palette.length).toBeGreaterThan(0)
      })
    })

    test('default palette has expected length', () => {
      expect(colorPalettesMap.default).toHaveLength(6)
    })
  })

  describe('getRelativeDepthColor', () => {
    const testColors = ['#FF0000', '#00FF00', '#0000FF']

    test('returns first color at depth 0', () => {
      expect(getRelativeDepthColor(testColors, 0)).toBe('#FF0000')
    })

    test('returns second color at depth 1', () => {
      expect(getRelativeDepthColor(testColors, 1)).toBe('#00FF00')
    })

    test('wraps around when depth exceeds palette length', () => {
      expect(getRelativeDepthColor(testColors, 3)).toBe('#FF0000')
      expect(getRelativeDepthColor(testColors, 4)).toBe('#00FF00')
      expect(getRelativeDepthColor(testColors, 6)).toBe('#FF0000')
    })

    test('handles large depth values', () => {
      expect(getRelativeDepthColor(testColors, 100)).toBe('#00FF00') // 100 % 3 = 1
      expect(getRelativeDepthColor(testColors, 999)).toBe('#FF0000') // 999 % 3 = 0
    })

    test('throws error for empty color array', () => {
      expect(() => getRelativeDepthColor([], 0)).toThrow(
        '[ruio][utils/colorPalettes] no colors found for the current theme',
      )
    })

    test('works with single color array', () => {
      const singleColor = ['#FFFFFF']
      expect(getRelativeDepthColor(singleColor, 0)).toBe('#FFFFFF')
      expect(getRelativeDepthColor(singleColor, 5)).toBe('#FFFFFF')
    })
  })
})
