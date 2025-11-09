import { render } from '@testing-library/react'
import { describe, test, expect, beforeEach } from 'vitest'
import { RuioContextProvider } from '@context/RuioContextProvider'
import UIContainer from '@components/UIContainer'
import SettingsModal from '@components/settings/SettingsModal'
import ColorPaletteDropdown from '@components/settings/ColorPaletteDropdown'
import SettingsRow from '@components/settings/SettingsRow'
import SettingsIcon from '@components/icons/SettingsIcon'
import ElementSelectIcon from '@components/icons/ElementSelectIcon'
import CloseModalIcon from '@components/icons/CloseModalIcon'
import ChevronIcon from '@components/icons/ChevronIcon'
import CheckmarkIcon from '@components/icons/CheckmarkIcon'
import UIToggleController from '@controllers/UIToggleController'

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

const LAYOUT_PROPS = ['display', 'position', 'flex-direction', 'align-items', 'justify-content', 'gap']

const SPACING_PROPS = ['padding', 'margin', 'width', 'height']

const VISUAL_PROPS = ['background-color', 'color', 'border', 'border-radius', 'box-shadow', 'opacity']

const TYPOGRAPHY_PROPS = ['font-size', 'font-weight', 'line-height', 'font-family']

describe('CSS Regression Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(
      'ruio-config',
      JSON.stringify({
        ruioEnabled: true,
        depth: 3,
        currentColorPalette: 'dynamic',
      }),
    )
  })

  describe('UIContainer', () => {
    test('container layout styles', () => {
      const { container } = render(
        <RuioContextProvider>
          <UIContainer />
        </RuioContextProvider>,
      )

      const uiContainer = container.querySelector('#ruio-exclude') as HTMLElement
      expect(uiContainer).toBeTruthy()

      const styles = captureComputedStyles(uiContainer, [...LAYOUT_PROPS, ...SPACING_PROPS, 'z-index'])
      expect(styles).toMatchSnapshot()
    })

    test('controls container layout', () => {
      const { container } = render(
        <RuioContextProvider>
          <UIContainer />
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
          <UIContainer />
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

      const modalContainer = container.querySelector('#ruio-settings-modal-container') as HTMLElement
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

      const styles = captureComputedStyles(dropdown, [...LAYOUT_PROPS, ...VISUAL_PROPS, 'cursor'])
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

  describe('Icon Components', () => {
    describe('SettingsIcon', () => {
      test('button element styles when active', () => {
        const { container } = render(
          <RuioContextProvider>
            <SettingsIcon onClick={() => {}} />
          </RuioContextProvider>,
        )

        const button = container.querySelector('#ruio-settings-icon') as HTMLElement
        expect(button).toBeTruthy()

        const styles = captureComputedStyles(button, [
          ...VISUAL_PROPS,
          ...SPACING_PROPS,
          'cursor',
          'transform',
          'transition',
        ])
        expect(styles).toMatchSnapshot()
      })

      test('SVG outline path has correct stroke and fill', () => {
        const { container } = render(
          <RuioContextProvider>
            <SettingsIcon onClick={() => {}} />
          </RuioContextProvider>,
        )

        const outlinePath = container.querySelector('path') as SVGPathElement
        expect(outlinePath).toBeTruthy()

        const styles = captureComputedStyles(outlinePath as unknown as HTMLElement, [
          'fill',
          'stroke',
          'stroke-width',
        ])
        expect(styles).toMatchSnapshot()
      })

      test('SVG element has correct fill', () => {
        const { container } = render(
          <RuioContextProvider>
            <SettingsIcon onClick={() => {}} />
          </RuioContextProvider>,
        )

        const svg = container.querySelector('svg') as SVGElement
        expect(svg).toBeTruthy()

        const styles = captureComputedStyles(svg as unknown as HTMLElement, ['fill', 'border-radius'])
        expect(styles).toMatchSnapshot()
      })
    })

    describe('ElementSelectIcon', () => {
      test('button element styles when active', () => {
        const { container } = render(
          <RuioContextProvider>
            <ElementSelectIcon onClick={() => {}} />
          </RuioContextProvider>,
        )

        const button = container.querySelector('#ruio-element-select-icon') as HTMLElement
        expect(button).toBeTruthy()

        const styles = captureComputedStyles(button, [
          ...VISUAL_PROPS,
          ...SPACING_PROPS,
          'cursor',
          'transform',
          'transition',
        ])
        expect(styles).toMatchSnapshot()
      })

      test('SVG outline path has correct stroke', () => {
        const { container } = render(
          <RuioContextProvider>
            <ElementSelectIcon onClick={() => {}} />
          </RuioContextProvider>,
        )

        const outlinePath = container.querySelector('path') as SVGPathElement
        expect(outlinePath).toBeTruthy()

        const styles = captureComputedStyles(outlinePath as unknown as HTMLElement, [
          'fill',
          'stroke',
          'stroke-width',
        ])
        expect(styles).toMatchSnapshot()
      })
    })

    describe('CloseModalIcon', () => {
      test('button element styles', () => {
        const { container } = render(
          <RuioContextProvider>
            <CloseModalIcon onClick={() => {}} />
          </RuioContextProvider>,
        )

        const button = container.querySelector('button') as HTMLElement
        expect(button).toBeTruthy()

        const styles = captureComputedStyles(button, [
          ...VISUAL_PROPS,
          ...SPACING_PROPS,
          'cursor',
          'transition',
        ])
        expect(styles).toMatchSnapshot()
      })

      test('SVG stroke color', () => {
        const { container } = render(
          <RuioContextProvider>
            <CloseModalIcon onClick={() => {}} />
          </RuioContextProvider>,
        )

        const svg = container.querySelector('svg') as SVGElement
        expect(svg).toBeTruthy()

        const styles = captureComputedStyles(svg as unknown as HTMLElement, ['stroke'])
        expect(styles).toMatchSnapshot()
      })
    })

    describe('ChevronIcon', () => {
      test('button element styles', () => {
        const { container } = render(
          <RuioContextProvider>
            <ChevronIcon isOpen={false} />
          </RuioContextProvider>,
        )

        const button = container.querySelector('button') as HTMLElement
        expect(button).toBeTruthy()

        const styles = captureComputedStyles(button, [
          ...VISUAL_PROPS,
          ...SPACING_PROPS,
          'cursor',
          'position',
        ])
        expect(styles).toMatchSnapshot()
      })

      test('SVG transform when inactive', () => {
        const { container } = render(
          <RuioContextProvider>
            <ChevronIcon isOpen={false} />
          </RuioContextProvider>,
        )

        const svg = container.querySelector('svg') as SVGElement
        expect(svg).toBeTruthy()

        const styles = captureComputedStyles(svg as unknown as HTMLElement, [
          'transform',
          'transition',
          'fill',
        ])
        expect(styles).toMatchSnapshot()
      })

      test('SVG transform when active', () => {
        const { container } = render(
          <RuioContextProvider>
            <ChevronIcon isOpen={true} />
          </RuioContextProvider>,
        )

        const svg = container.querySelector('svg') as SVGElement
        expect(svg).toBeTruthy()

        const styles = captureComputedStyles(svg as unknown as HTMLElement, ['transform', 'transition'])
        expect(styles).toMatchSnapshot()
      })
    })

    describe('CheckmarkIcon', () => {
      test('button element styles', () => {
        const { container } = render(
          <RuioContextProvider>
            <CheckmarkIcon />
          </RuioContextProvider>,
        )

        const button = container.querySelector('button') as HTMLElement
        expect(button).toBeTruthy()

        const styles = captureComputedStyles(button, [
          ...VISUAL_PROPS,
          ...SPACING_PROPS,
          'cursor',
          'position',
        ])
        expect(styles).toMatchSnapshot()
      })

      test('path has fill: none to prevent filled appearance', () => {
        const { container } = render(
          <RuioContextProvider>
            <CheckmarkIcon />
          </RuioContextProvider>,
        )

        const path = container.querySelector('path') as SVGPathElement
        expect(path).toBeTruthy()

        const styles = captureComputedStyles(path as unknown as HTMLElement, [
          'fill',
          'stroke',
          'stroke-width',
          'stroke-linecap',
        ])
        expect(styles).toMatchSnapshot()
      })
    })
  })

  describe('UIToggleController', () => {
    test('container styles', () => {
      const { container } = render(
        <RuioContextProvider>
          <UIToggleController />
        </RuioContextProvider>,
      )

      const toggleContainer = container.firstChild as HTMLElement
      expect(toggleContainer).toBeTruthy()

      const styles = captureComputedStyles(toggleContainer, [
        ...LAYOUT_PROPS,
        ...SPACING_PROPS,
        'position',
        'transition',
      ])
      expect(styles).toMatchSnapshot()
    })

    test('button styles when enabled', () => {
      const { container } = render(
        <RuioContextProvider>
          <UIToggleController />
        </RuioContextProvider>,
      )

      const button = container.querySelector('button') as HTMLElement
      expect(button).toBeTruthy()

      const styles = captureComputedStyles(button, [
        ...VISUAL_PROPS,
        ...SPACING_PROPS,
        'transform',
        'transition',
      ])
      expect(styles).toMatchSnapshot()
    })

    test('background div styles when active', () => {
      const { container } = render(
        <RuioContextProvider>
          <UIToggleController />
        </RuioContextProvider>,
      )

      const bgDiv = container.querySelector('button')?.previousSibling as HTMLElement
      expect(bgDiv).toBeTruthy()

      const styles = captureComputedStyles(bgDiv, [
        'background',
        'background-color',
        'transform',
        'opacity',
        'transition',
        'border-radius',
        'position',
      ])
      expect(styles).toMatchSnapshot()
    })

    test('logo SVG fill color', () => {
      const { container } = render(
        <RuioContextProvider>
          <UIToggleController />
        </RuioContextProvider>,
      )

      const svg = container.querySelector('svg') as SVGElement
      expect(svg).toBeTruthy()

      const styles = captureComputedStyles(svg as unknown as HTMLElement, ['fill'])
      expect(styles).toMatchSnapshot()
    })
  })
})
