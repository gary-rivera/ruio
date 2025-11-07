import { render } from '@testing-library/react'
import { describe, test, expect, beforeEach } from 'vitest'
import { RuioContextProvider } from '@context/RuioContextProvider'
import RuioUIContainer from '@components/RuioUIContainer'
import SettingsModal from '@components/settings/SettingsModal'
import ColorPaletteDropdown from '@components/settings/ColorPaletteDropdown'

/**
 * HTML Structure Snapshot Tests
 *
 * These tests capture the rendered HTML and className attributes
 * to detect changes in DOM structure and CSS class usage during refactoring.
 */

describe('HTML Structure Snapshots', () => {
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

  test('RuioUIContainer HTML structure', () => {
    const { container } = render(
      <RuioContextProvider>
        <RuioUIContainer />
      </RuioContextProvider>,
    )
    expect(container.innerHTML).toMatchSnapshot()
  })

  test('SettingsModal HTML structure (open)', () => {
    const { container } = render(
      <RuioContextProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </RuioContextProvider>,
    )
    expect(container.innerHTML).toMatchSnapshot()
  })

  test('ColorPaletteDropdown HTML structure (closed)', () => {
    const { container } = render(
      <RuioContextProvider>
        <ColorPaletteDropdown isOpen={false} setIsOpen={() => {}} />
      </RuioContextProvider>,
    )
    expect(container.innerHTML).toMatchSnapshot()
  })

  test('ColorPaletteDropdown HTML structure (open)', () => {
    const { container } = render(
      <RuioContextProvider>
        <ColorPaletteDropdown isOpen={true} setIsOpen={() => {}} />
      </RuioContextProvider>,
    )
    expect(container.innerHTML).toMatchSnapshot()
  })
})
