import {
  loadConfig,
  saveConfig,
  getConfigValue,
  setConfigValueAtKey,
  resetConfig,
  getConfigWithDefaults,
  parseSelectorFromSelectedElement,
  type ConfigLocalState,
} from '@utils/config'
import { describe, test, expect, beforeEach } from 'vitest'

const RUIO_CONFIG_KEY = 'ruio-config'

describe('config', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('loadConfig', () => {
    test('returns null when no config exists', () => {
      expect(loadConfig()).toBeNull()
    })

    test('returns stored config when it exists', () => {
      const config: ConfigLocalState = {
        ruioEnabled: true,
        depth: 5,
        currentColorPalette: 'neon',
        rootElementSelector: '#app',
      }
      localStorage.setItem(RUIO_CONFIG_KEY, JSON.stringify(config))
      expect(loadConfig()).toEqual(config)
    })

    test('returns null on invalid JSON', () => {
      const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {})
      localStorage.setItem(RUIO_CONFIG_KEY, 'invalid json')
      expect(loadConfig()).toBeNull()
      consoleErrorMock.mockRestore()
    })
  })

  describe('saveConfig', () => {
    test('stores config as JSON in localStorage', () => {
      const config: ConfigLocalState = {
        ruioEnabled: true,
        depth: 5,
        currentColorPalette: 'neon',
        rootElementSelector: '#app',
      }
      saveConfig(config)
      const stored = localStorage.getItem(RUIO_CONFIG_KEY)
      expect(JSON.parse(stored!)).toEqual(config)
    })

    test('overwrites existing config', () => {
      const config1: ConfigLocalState = { ruioEnabled: false, depth: 3, currentColorPalette: 'default' }
      const config2: ConfigLocalState = { ruioEnabled: true, depth: 10, currentColorPalette: 'roygbiv' }
      saveConfig(config1)
      saveConfig(config2)
      expect(loadConfig()).toEqual(config2)
    })
  })

  describe('getConfigValue', () => {
    test('returns stored value when it exists', () => {
      const config: ConfigLocalState = { ruioEnabled: true, depth: 5, currentColorPalette: 'neon' }
      saveConfig(config)
      expect(getConfigValue('depth')).toBe(5)
      expect(getConfigValue('currentColorPalette')).toBe('neon')
    })

    test('returns default value when no stored value exists', () => {
      expect(getConfigValue('depth')).toBe(3)
      expect(getConfigValue('ruioEnabled')).toBe(false)
      expect(getConfigValue('currentColorPalette')).toBe('default')
    })

    test('returns default when config exists but key is missing', () => {
      const partialConfig = { ruioEnabled: true, depth: 3, currentColorPalette: 'default' }
      saveConfig(partialConfig)
      expect(getConfigValue('rootElementSelector')).toBe('#root')
    })
  })

  describe('setConfigValueAtKey', () => {
    test('creates config and stores value when no config exists', () => {
      setConfigValueAtKey('depth', 10)
      const config = loadConfig()
      expect(config?.depth).toBe(10)
    })

    test('updates existing config without overwriting other values', () => {
      const initialConfig: ConfigLocalState = {
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'neon',
        rootElementSelector: '#app',
      }
      saveConfig(initialConfig)

      setConfigValueAtKey('depth', 10)

      const updated = loadConfig()
      expect(updated).toEqual({ ...initialConfig, depth: 10 })
    })

    test('handles boolean values', () => {
      setConfigValueAtKey('ruioEnabled', true)
      expect(getConfigValue('ruioEnabled')).toBe(true)
    })

    test('handles string values', () => {
      setConfigValueAtKey('currentColorPalette', 'roygbiv')
      expect(getConfigValue('currentColorPalette')).toBe('roygbiv')
    })
  })

  describe('resetConfig', () => {
    test('removes config from localStorage', () => {
      const config: ConfigLocalState = { ruioEnabled: true, depth: 5, currentColorPalette: 'neon' }
      saveConfig(config)
      resetConfig()
      expect(localStorage.getItem(RUIO_CONFIG_KEY)).toBeNull()
    })
  })

  describe('getConfigWithDefaults', () => {
    test('returns default config when no stored config exists', () => {
      const config = getConfigWithDefaults()
      expect(config).toEqual({
        ruioEnabled: false,
        depth: 3,
        currentColorPalette: 'default',
        rootElementSelector: '#root',
      })
    })

    test('merges stored config with defaults', () => {
      const partialConfig = { ruioEnabled: true, depth: 3, currentColorPalette: 'neon' }
      saveConfig(partialConfig as ConfigLocalState)

      const config = getConfigWithDefaults()
      expect(config).toEqual({
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'neon',
        rootElementSelector: '#root',
      })
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

    test('returns joined class selector when element has multiple classes', () => {
      const element = document.createElement('div')
      element.classList.add('first-class', 'second-class')
      expect(parseSelectorFromSelectedElement(element)).toBe('.first-class.second-class')
    })

    test('filters out internal ruio- classes', () => {
      const element = document.createElement('div')
      element.classList.add('my-class', 'ruio-hovered', 'another-class')
      expect(parseSelectorFromSelectedElement(element)).toBe('.my-class.another-class')
    })

    test('prioritizes id over class', () => {
      const element = document.createElement('div')
      element.id = 'unique-id'
      element.className = 'some-class'
      expect(parseSelectorFromSelectedElement(element)).toBe('#unique-id')
    })

    test('generates selector path when element has only ruio- classes', () => {
      const parent = document.createElement('div')
      const element = document.createElement('section')
      element.classList.add('ruio-hovered')
      parent.appendChild(element)
      document.body.appendChild(parent)

      const selector = parseSelectorFromSelectedElement(element)
      expect(selector).toContain('section')
      expect(selector).toContain('div')

      document.body.removeChild(parent)
    })

    test('generates selector path for element with no id or classes', () => {
      const parent = document.createElement('div')
      const element = document.createElement('main')
      parent.appendChild(element)
      document.body.appendChild(parent)

      const selector = parseSelectorFromSelectedElement(element)
      // Should generate path like "div > main" or with nth-of-type
      expect(selector).toContain('main')
      expect(selector).toContain('div')

      document.body.removeChild(parent)
    })

    test('generates selector path with nth-of-type for multiple siblings', () => {
      const parent = document.createElement('div')
      const element1 = document.createElement('article')
      const element2 = document.createElement('article')
      const element3 = document.createElement('article')

      parent.appendChild(element1)
      parent.appendChild(element2)
      parent.appendChild(element3)
      document.body.appendChild(parent)

      const selector = parseSelectorFromSelectedElement(element2)
      // Should generate something like "div > article:nth-of-type(2)"
      expect(selector).toContain('article:nth-of-type(2)')

      document.body.removeChild(parent)
    })
  })
})
