import { render } from '@testing-library/react'
import { describe, test, expect, beforeEach } from 'vitest'
import { RuioContextProvider } from '@context/RuioContextProvider'
import RuioUIContainer from '@components/RuioUIContainer'
import SettingsModal from '@components/settings/SettingsModal'
import ColorPaletteDropdown from '@components/settings/ColorPaletteDropdown'
import SettingsRow from '@components/settings/SettingsRow'

/**
 * CSS Regression Tests
 *
 * These tests capture computed styles to detect unintended visual changes
 * during CSS refactoring. Run these before and after CSS changes.
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

const LAYOUT_PROPS = [
  'display',
  'position',
  'flex-direction',
  'align-items',
  'justify-content',
  'gap',
]

const SPACING_PROPS = ['padding', 'margin', 'width', 'height']

const VISUAL_PROPS = [
  'background-color',
  'color',
  'border',
  'border-radius',
  'box-shadow',
  'opacity',
]

const TYPOGRAPHY_PROPS = ['font-size', 'font-weight', 'line-height', 'font-family']

describe('CSS Regression Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(
      'ruio-config',
      JSON.stringify({
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'default',
      }),
    )
  })

  describe('RuioUIContainer', () => {
    test('container layout styles', () => {
      const { container } = render(
        <RuioContextProvider>
          <RuioUIContainer />
        </RuioContextProvider>,
      )

      const uiContainer = container.querySelector('#ruio-exclude') as HTMLElement
      expect(uiContainer).toBeTruthy()

      const styles = captureComputedStyles(uiContainer, [
        ...LAYOUT_PROPS,
        ...SPACING_PROPS,
        'z-index',
      ])
      expect(styles).toMatchSnapshot()
    })

    test('controls container layout', () => {
      const { container } = render(
        <RuioContextProvider>
          <RuioUIContainer />
        </RuioContextProvider>,
      )

      const controlsContainer = container.querySelector('#ruio-controls-container') as HTMLElement
      expect(controlsContainer).toBeTruthy()

      const styles = captureComputedStyles(controlsContainer, [...LAYOUT_PROPS, ...SPACING_PROPS])
      expect(styles).toMatchSnapshot()
    })

    test('icon container styles', () => {
      const { container } = render(
        <RuioContextProvider>
          <RuioUIContainer />
        </RuioContextProvider>,
      )

      const settingsContainer = container.querySelector('#ruio-settings-container') as HTMLElement
      expect(settingsContainer).toBeTruthy()

      const styles = captureComputedStyles(settingsContainer, [
        ...LAYOUT_PROPS,
        ...VISUAL_PROPS,
        'cursor',
        'transition',
      ])
      expect(styles).toMatchSnapshot()
    })
  })

  describe('SettingsModal', () => {
    test('modal container when open', () => {
      const { container } = render(
        <RuioContextProvider>
          <SettingsModal isOpen={true} onClose={() => {}} />
        </RuioContextProvider>,
      )

      const modalContainer = container.querySelector(
        '#ruio-settings-modal-container',
      ) as HTMLElement
      expect(modalContainer).toBeTruthy()

      const styles = captureComputedStyles(modalContainer, [
        ...LAYOUT_PROPS,
        ...SPACING_PROPS,
        ...VISUAL_PROPS,
        'z-index',
        'transform',
        'transition',
      ])
      expect(styles).toMatchSnapshot()
    })

    test('button styles', () => {
      const { container } = render(
        <RuioContextProvider>
          <SettingsModal isOpen={true} onClose={() => {}} />
        </RuioContextProvider>,
      )

      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBeGreaterThan(0)

      const buttonStyle = captureComputedStyles(buttons[0], [
        ...VISUAL_PROPS,
        ...TYPOGRAPHY_PROPS,
        'cursor',
        'transition',
      ])
      expect(buttonStyle).toMatchSnapshot()
    })

    test('input field styles', () => {
      const { container } = render(
        <RuioContextProvider>
          <SettingsModal isOpen={true} onClose={() => {}} />
        </RuioContextProvider>,
      )

      const input = container.querySelector('input[type="text"]') as HTMLElement
      expect(input).toBeTruthy()

      const styles = captureComputedStyles(input, [
        ...VISUAL_PROPS,
        ...TYPOGRAPHY_PROPS,
        ...SPACING_PROPS,
      ])
      expect(styles).toMatchSnapshot()
    })
  })

  describe('ColorPaletteDropdown', () => {
    test('dropdown container styles', () => {
      const { container } = render(
        <RuioContextProvider>
          <ColorPaletteDropdown isOpen={false} setIsOpen={() => {}} />
        </RuioContextProvider>,
      )

      const dropdown = container.firstChild as HTMLElement
      expect(dropdown).toBeTruthy()

      const styles = captureComputedStyles(dropdown, [
        ...LAYOUT_PROPS,
        ...VISUAL_PROPS,
        'cursor',
      ])
      expect(styles).toMatchSnapshot()
    })

    test('dropdown menu when open', () => {
      const { container } = render(
        <RuioContextProvider>
          <ColorPaletteDropdown isOpen={true} setIsOpen={() => {}} />
        </RuioContextProvider>,
      )

      const dropdown = container.querySelector('div > div') as HTMLElement
      expect(dropdown).toBeTruthy()

      const styles = captureComputedStyles(dropdown, [
        ...LAYOUT_PROPS,
        ...SPACING_PROPS,
        ...VISUAL_PROPS,
        'max-height',
        'overflow-y',
      ])
      expect(styles).toMatchSnapshot()
    })
  })

  describe('SettingsRow', () => {
    test('row layout and spacing', () => {
      const { container } = render(
        <SettingsRow label="Test">
          <div>Content</div>
        </SettingsRow>,
      )

      const row = container.firstChild as HTMLElement
      const styles = captureComputedStyles(row, [...LAYOUT_PROPS, ...SPACING_PROPS])
      expect(styles).toMatchSnapshot()
    })
  })
})
