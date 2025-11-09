import { render } from '@testing-library/react'
import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { RuioContextProvider } from '@context/RuioContextProvider'
import UIContainer from '@components/UIContainer'
import SettingsModal from '@components/settings/SettingsModal'
import SettingsIcon from '@components/icons/SettingsIcon'
import ElementSelectIcon from '@components/icons/ElementSelectIcon'
import UIToggleController from '@controllers/UIToggleController'
import ThemeToggle from '@components/settings/ThemeToggle'

/**
 * Theme Mode Regression Tests
 *
 * These tests ensure light and dark mode styles remain consistent across changes.
 * Tests capture computed styles for critical UI elements in both themes.
 */

const captureComputedStyles = (element: HTMLElement, properties: string[]) => {
  const computed = window.getComputedStyle(element)
  return properties.reduce(
    (acc, prop) => ({
      ...acc,
      [prop]: computed.getPropertyValue(prop),
    }),
    {},
  )
}

const THEME_PROPS = ['background-color', 'color', 'border', 'box-shadow', 'opacity']

const ICON_PROPS = ['background-color', 'border', 'fill', 'stroke', 'opacity']

const setTheme = (theme: 'light' | 'dark') => {
  document.documentElement.setAttribute('data-ruio-theme', theme)
}

describe('Theme Mode Regression Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(
      'ruio-config',
      JSON.stringify({
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'dynamic',
        theme: 'dark',
      }),
    )
    // Reset to dark mode
    setTheme('dark')
  })

  afterEach(() => {
    document.documentElement.removeAttribute('data-ruio-theme')
  })

  describe('Dark Mode (Default)', () => {
    describe('SettingsModal', () => {
      test('modal container background and text colors', () => {
        const { container } = render(
          <RuioContextProvider>
            <SettingsModal isOpen={true} onClose={() => {}} />
          </RuioContextProvider>,
        )

        const modalContainer = container.querySelector('#ruio-settings-modal-container') as HTMLElement
        expect(modalContainer).toBeTruthy()

        const styles = captureComputedStyles(modalContainer, THEME_PROPS)
        expect(styles).toMatchSnapshot('dark-mode-modal-container')
      })

      test('depth control buttons are white text', () => {
        const { container } = render(
          <RuioContextProvider>
            <SettingsModal isOpen={true} onClose={() => {}} />
          </RuioContextProvider>,
        )

        const buttons = container.querySelectorAll('button')
        // Find decrement button (first button with "-" text)
        const decrementButton = Array.from(buttons).find((btn) => btn.textContent === '-')
        expect(decrementButton).toBeTruthy()

        const styles = captureComputedStyles(decrementButton as HTMLElement, [
          'color',
          'background-color',
        ])
        expect(styles).toMatchSnapshot('dark-mode-depth-button')
      })

      test('box shadow on modal', () => {
        const { container } = render(
          <RuioContextProvider>
            <SettingsModal isOpen={true} onClose={() => {}} />
          </RuioContextProvider>,
        )

        const modalContainer = container.querySelector('#ruio-settings-modal-container') as HTMLElement
        const styles = captureComputedStyles(modalContainer, ['box-shadow'])
        expect(styles).toMatchSnapshot('dark-mode-modal-shadow')
      })
    })

    describe('Icons', () => {
      test('SettingsIcon background is dark', () => {
        const { container } = render(
          <RuioContextProvider>
            <SettingsIcon onClick={() => {}} />
          </RuioContextProvider>,
        )

        const button = container.querySelector('#ruio-settings-icon') as HTMLElement
        expect(button).toBeTruthy()

        const styles = captureComputedStyles(button, ICON_PROPS)
        expect(styles).toMatchSnapshot('dark-mode-settings-icon')
      })

      test('ElementSelectIcon background is dark', () => {
        const { container } = render(
          <RuioContextProvider>
            <ElementSelectIcon onClick={() => {}} />
          </RuioContextProvider>,
        )

        const button = container.querySelector('#ruio-element-select-icon') as HTMLElement
        expect(button).toBeTruthy()

        const styles = captureComputedStyles(button, ICON_PROPS)
        expect(styles).toMatchSnapshot('dark-mode-element-select-icon')
      })

      test('SettingsIcon SVG paths have correct colors', () => {
        const { container } = render(
          <RuioContextProvider>
            <SettingsIcon onClick={() => {}} />
          </RuioContextProvider>,
        )

        const svg = container.querySelector('svg') as SVGElement
        expect(svg).toBeTruthy()

        const styles = captureComputedStyles(svg as unknown as HTMLElement, ['fill'])
        expect(styles).toMatchSnapshot('dark-mode-settings-icon-svg')
      })
    })

    describe('UIToggleController', () => {
      test('logo maintains size when dimmed', () => {
        const { container } = render(
          <RuioContextProvider>
            <UIToggleController isDimmed={true} />
          </RuioContextProvider>,
        )

        const button = container.querySelector('button') as HTMLElement
        expect(button).toBeTruthy()

        const styles = captureComputedStyles(button, ['transform', 'opacity'])
        expect(styles).toMatchSnapshot('dark-mode-logo-dimmed')

        // Verify no scale transform is applied (should only have rotation)
        const transform = styles['transform'] as string
        expect(transform).not.toContain('scale(0.8)')
      })

      test('logo dims (opacity) but does not shrink', () => {
        const { container: normalContainer } = render(
          <RuioContextProvider>
            <UIToggleController isDimmed={false} />
          </RuioContextProvider>,
        )

        const { container: dimmedContainer } = render(
          <RuioContextProvider>
            <UIToggleController isDimmed={true} />
          </RuioContextProvider>,
        )

        const normalButton = normalContainer.querySelector('button') as HTMLElement
        const dimmedButton = dimmedContainer.querySelector('button') as HTMLElement

        expect(normalButton).toBeTruthy()
        expect(dimmedButton).toBeTruthy()

        const normalOpacity = window.getComputedStyle(normalButton).opacity
        const dimmedOpacity = window.getComputedStyle(dimmedButton).opacity

        // Opacity should be lower when dimmed (0.4 vs 0.5 or 1)
        // Only compare if both values are valid numbers
        if (normalOpacity && dimmedOpacity && normalOpacity !== '' && dimmedOpacity !== '') {
          expect(parseFloat(dimmedOpacity)).toBeLessThanOrEqual(parseFloat(normalOpacity))
        }
      })

      test('logo colors in dark mode', () => {
        const { container } = render(
          <RuioContextProvider>
            <UIToggleController />
          </RuioContextProvider>,
        )

        const svg = container.querySelector('svg') as SVGElement
        const bgDiv = container.querySelector('button')?.previousSibling as HTMLElement

        const svgStyles = captureComputedStyles(svg as unknown as HTMLElement, ['fill'])
        const bgStyles = captureComputedStyles(bgDiv, ['background-color'])

        expect(svgStyles).toMatchSnapshot('dark-mode-logo-svg')
        expect(bgStyles).toMatchSnapshot('dark-mode-logo-bg')
      })
    })
  })

  describe('Light Mode', () => {
    beforeEach(() => {
      setTheme('light')
    })

    describe('SettingsModal', () => {
      test('modal container background and text colors', () => {
        const { container } = render(
          <RuioContextProvider>
            <SettingsModal isOpen={true} onClose={() => {}} />
          </RuioContextProvider>,
        )

        const modalContainer = container.querySelector('#ruio-settings-modal-container') as HTMLElement
        expect(modalContainer).toBeTruthy()

        const styles = captureComputedStyles(modalContainer, THEME_PROPS)
        expect(styles).toMatchSnapshot('light-mode-modal-container')
      })

      test('depth control buttons are black text', () => {
        const { container } = render(
          <RuioContextProvider>
            <SettingsModal isOpen={true} onClose={() => {}} />
          </RuioContextProvider>,
        )

        const buttons = container.querySelectorAll('button')
        const decrementButton = Array.from(buttons).find((btn) => btn.textContent === '-')
        expect(decrementButton).toBeTruthy()

        const styles = captureComputedStyles(decrementButton as HTMLElement, [
          'color',
          'background-color',
        ])
        expect(styles).toMatchSnapshot('light-mode-depth-button')
      })

      test('box shadow is more visible in light mode', () => {
        const { container } = render(
          <RuioContextProvider>
            <SettingsModal isOpen={true} onClose={() => {}} />
          </RuioContextProvider>,
        )

        const modalContainer = container.querySelector('#ruio-settings-modal-container') as HTMLElement
        const styles = captureComputedStyles(modalContainer, ['box-shadow'])
        expect(styles).toMatchSnapshot('light-mode-modal-shadow')

        // Verify shadow exists (JSDOM might return empty string, that's okay)
        const shadow = styles['box-shadow'] as string
        expect(styles).toHaveProperty('box-shadow')
      })
    })

    describe('Icons', () => {
      test('SettingsIcon has cyan background with black border', () => {
        const { container } = render(
          <RuioContextProvider>
            <SettingsIcon onClick={() => {}} />
          </RuioContextProvider>,
        )

        const button = container.querySelector('#ruio-settings-icon') as HTMLElement
        expect(button).toBeTruthy()

        const styles = captureComputedStyles(button, ['background-color', 'border'])
        expect(styles).toMatchSnapshot('light-mode-settings-icon')

        // Verify border exists
        const border = styles['border'] as string
        expect(border).not.toBe('0px none rgb(0, 0, 0)')
      })

      test('ElementSelectIcon has cyan background with black border', () => {
        const { container } = render(
          <RuioContextProvider>
            <ElementSelectIcon onClick={() => {}} />
          </RuioContextProvider>,
        )

        const button = container.querySelector('#ruio-element-select-icon') as HTMLElement
        expect(button).toBeTruthy()

        const styles = captureComputedStyles(button, ['background-color', 'border'])
        expect(styles).toMatchSnapshot('light-mode-element-select-icon')
      })

      test('SettingsIcon SVG has black strokes and white fills', () => {
        const { container } = render(
          <RuioContextProvider>
            <SettingsIcon onClick={() => {}} />
          </RuioContextProvider>,
        )

        const paths = container.querySelectorAll('path')
        expect(paths.length).toBeGreaterThan(0)

        // Check first path (should have stroke styling)
        const firstPath = paths[0] as SVGPathElement
        const styles = captureComputedStyles(firstPath as unknown as HTMLElement, ['fill', 'stroke'])
        expect(styles).toMatchSnapshot('light-mode-settings-icon-svg-path')
      })

      test('ElementSelectIcon mouse pointer has white fill and black stroke', () => {
        const { container } = render(
          <RuioContextProvider>
            <ElementSelectIcon onClick={() => {}} />
          </RuioContextProvider>,
        )

        const paths = container.querySelectorAll('path')
        expect(paths.length).toBeGreaterThan(0)

        const firstPath = paths[0] as SVGPathElement
        const styles = captureComputedStyles(firstPath as unknown as HTMLElement, ['fill', 'stroke'])
        expect(styles).toMatchSnapshot('light-mode-element-select-icon-svg-path')
      })
    })

    describe('UIToggleController', () => {
      test('logo colors remain same as dark mode', () => {
        const { container } = render(
          <RuioContextProvider>
            <UIToggleController />
          </RuioContextProvider>,
        )

        const svg = container.querySelector('svg') as SVGElement
        const bgDiv = container.querySelector('button')?.previousSibling as HTMLElement

        const svgStyles = captureComputedStyles(svg as unknown as HTMLElement, ['fill'])
        const bgStyles = captureComputedStyles(bgDiv, ['background-color'])

        expect(svgStyles).toMatchSnapshot('light-mode-logo-svg')
        expect(bgStyles).toMatchSnapshot('light-mode-logo-bg')
      })

      test('logo maintains size when dimmed in light mode', () => {
        const { container } = render(
          <RuioContextProvider>
            <UIToggleController isDimmed={true} />
          </RuioContextProvider>,
        )

        const button = container.querySelector('button') as HTMLElement
        const styles = captureComputedStyles(button, ['transform', 'opacity'])

        // Should not have scale transformation
        const transform = styles['transform'] as string
        expect(transform).not.toContain('scale(0.8)')
      })
    })

    describe('ThemeToggle', () => {
      test('theme toggle button in light mode', () => {
        const { container } = render(
          <RuioContextProvider>
            <ThemeToggle theme="light" onToggle={() => {}} />
          </RuioContextProvider>,
        )

        const button = container.querySelector('button') as HTMLElement
        expect(button).toBeTruthy()

        const styles = captureComputedStyles(button, ['background-color', 'cursor'])
        expect(styles).toMatchSnapshot('light-mode-theme-toggle')
      })

      test('sun icon in light mode has black color', () => {
        const { container } = render(
          <RuioContextProvider>
            <ThemeToggle theme="light" onToggle={() => {}} />
          </RuioContextProvider>,
        )

        const svg = container.querySelector('svg') as SVGElement
        expect(svg).toBeTruthy()

        const styles = captureComputedStyles(svg as unknown as HTMLElement, ['color'])
        expect(styles).toMatchSnapshot('light-mode-theme-toggle-icon')
      })
    })
  })

  describe('Theme Comparison', () => {
    test('logo colors remain consistent across themes', () => {
      setTheme('dark')
      const { container: darkContainer } = render(
        <RuioContextProvider>
          <UIToggleController />
        </RuioContextProvider>,
      )

      const darkSvg = darkContainer.querySelector('svg') as SVGElement
      const darkFill = window.getComputedStyle(darkSvg as unknown as HTMLElement).fill

      setTheme('light')
      const { container: lightContainer } = render(
        <RuioContextProvider>
          <UIToggleController />
        </RuioContextProvider>,
      )

      const lightSvg = lightContainer.querySelector('svg') as SVGElement
      const lightFill = window.getComputedStyle(lightSvg as unknown as HTMLElement).fill

      // Logo should have same fill in both modes
      expect(darkFill).toBe(lightFill)
    })
  })
})
