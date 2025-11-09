import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UIContainer from '@components/UIContainer'
import { RuioContextProvider } from '@context/RuioContextProvider'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import styles from '@components/UIContainer.module.css'

// Mock the UIToggleController to expose isDimmed prop
vi.mock('@controllers/UIToggleController', () => ({
  default: ({ isDimmed }: { isDimmed: boolean }) => (
    <div data-testid="ruio-toggle-controller" data-dimmed={isDimmed}>
      Toggle
    </div>
  ),
}))

// Mock applyCommittedOutlines and ElementPicker
vi.mock('@utils/outline', async () => {
  const actual = await vi.importActual<typeof import('@utils/outline')>('@utils/outline')
  return {
    ...actual,
    applyCommittedOutlines: vi.fn(),
    resetCommittedOutlines: vi.fn(),
  }
})

vi.mock('@controllers/ElementPicker', () => ({
  ElementPicker: vi.fn(() => vi.fn()),
}))

describe('UIContainer - Icon Dimming', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // Set ruioEnabled to true so settings modal can render
    localStorage.setItem('ruioEnabled', 'true')
  })

  test('settings icon container has icon-active class when settings is open', async () => {
    render(
      <RuioContextProvider>
        <UIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const settingsButton = settingsContainer.querySelector('button')

    await userEvent.click(settingsButton!)

    expect(settingsContainer.className).toContain(styles.iconActive)
  })

  test('element select icon container has icon-dimmed class when settings is open', async () => {
    render(
      <RuioContextProvider>
        <UIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const settingsButton = settingsContainer.querySelector('button')

    await userEvent.click(settingsButton!)

    expect(elementSelectContainer.className).toContain(styles.iconDimmed)
  })

  test('logo is dimmed when settings icon is clicked', async () => {
    render(
      <RuioContextProvider>
        <UIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const settingsButton = settingsContainer.querySelector('button')
    const logo = screen.getByTestId('ruio-toggle-controller')

    expect(logo.getAttribute('data-dimmed')).toBe('false')

    await userEvent.click(settingsButton!)

    expect(logo.getAttribute('data-dimmed')).toBe('true')
  })

  test('logo is dimmed when element select mode is active', async () => {
    render(
      <RuioContextProvider>
        <UIContainer />
      </RuioContextProvider>,
    )

    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const elementSelectButton = elementSelectContainer.querySelector('button')
    const logo = screen.getByTestId('ruio-toggle-controller')

    expect(logo.getAttribute('data-dimmed')).toBe('false')

    await userEvent.click(elementSelectButton!)

    expect(logo.getAttribute('data-dimmed')).toBe('true')
  })

  test('settings icon container has icon-dimmed class when element select mode is active', async () => {
    render(
      <RuioContextProvider>
        <UIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const elementSelectButton = elementSelectContainer.querySelector('button')

    await userEvent.click(elementSelectButton!)

    expect(settingsContainer.className).toContain(styles.iconDimmed)
  })

  test('element select icon container has icon-active class when element select mode is active', async () => {
    render(
      <RuioContextProvider>
        <UIContainer />
      </RuioContextProvider>,
    )

    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const elementSelectButton = elementSelectContainer.querySelector('button')

    await userEvent.click(elementSelectButton!)

    expect(elementSelectContainer.className).toContain(styles.iconActive)
  })

  test('dimming stops when settings modal is closed', async () => {
    render(
      <RuioContextProvider>
        <UIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const settingsButton = settingsContainer.querySelector('button')
    const logo = screen.getByTestId('ruio-toggle-controller')

    // Open settings
    await userEvent.click(settingsButton!)

    expect(logo.getAttribute('data-dimmed')).toBe('true')
    expect(elementSelectContainer.className).toContain(styles.iconDimmed)

    // Close settings by clicking the button again (toggles)
    await userEvent.click(settingsButton!)

    expect(logo.getAttribute('data-dimmed')).toBe('false')
    expect(elementSelectContainer.className).not.toContain(styles.iconDimmed)
    expect(elementSelectContainer.className).not.toContain(styles.iconActive)
  })

  test('clicking element select icon twice toggles dimming on and off', async () => {
    render(
      <RuioContextProvider>
        <UIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const elementSelectButton = elementSelectContainer.querySelector('button')
    const logo = screen.getByTestId('ruio-toggle-controller')

    // First click - activate element select mode
    await userEvent.click(elementSelectButton!)

    expect(logo.getAttribute('data-dimmed')).toBe('true')
    expect(settingsContainer.className).toContain(styles.iconDimmed)

    // Second click - deactivate element select mode
    await userEvent.click(elementSelectButton!)

    expect(logo.getAttribute('data-dimmed')).toBe('false')
    expect(settingsContainer.className).not.toContain(styles.iconDimmed)
    expect(settingsContainer.className).not.toContain(styles.iconActive)
  })

  test('only one icon can be active at a time', async () => {
    render(
      <RuioContextProvider>
        <UIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const settingsButton = settingsContainer.querySelector('button')
    const elementSelectButton = elementSelectContainer.querySelector('button')

    // Activate settings
    await userEvent.click(settingsButton!)

    expect(settingsContainer.className).toContain(styles.iconActive)
    expect(elementSelectContainer.className).toContain(styles.iconDimmed)

    // Activate element select - settings should close
    await userEvent.click(elementSelectButton!)

    expect(settingsContainer.className).toContain(styles.iconDimmed)
    expect(elementSelectContainer.className).toContain(styles.iconActive)
  })

  test('icon containers have base icon-container class', () => {
    render(
      <RuioContextProvider>
        <UIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const elementSelectContainer = document.getElementById('ruio-element-select-container')!

    expect(settingsContainer.className).toContain(styles.iconContainer)
    expect(elementSelectContainer.className).toContain(styles.iconContainer)
  })

  test('clicking settings when element select is active deactivates element select mode', async () => {
    render(
      <RuioContextProvider>
        <UIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const settingsButton = settingsContainer.querySelector('button')
    const elementSelectButton = elementSelectContainer.querySelector('button')

    // Activate element select mode
    await userEvent.click(elementSelectButton!)

    expect(elementSelectContainer.className).toContain(styles.iconActive)
    expect(settingsContainer.className).toContain(styles.iconDimmed)

    // Click settings - should deactivate element select mode and activate settings
    await userEvent.click(settingsButton!)

    expect(settingsContainer.className).toContain(styles.iconActive)
    expect(elementSelectContainer.className).toContain(styles.iconDimmed)
    expect(elementSelectContainer.className).not.toContain(styles.iconActive)
  })
})
