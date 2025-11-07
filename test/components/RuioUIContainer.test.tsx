import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RuioUIContainer from '@components/RuioUIContainer'
import { RuioContextProvider } from '@context/RuioContextProvider'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import iconStyles from '@root/styles/Icon.module.css'

// Mock the RuioToggleController to expose isDimmed prop
vi.mock('@controllers/RuioToggleController', () => ({
  default: ({ isDimmed }: { isDimmed: boolean }) => (
    <div data-testid="ruio-toggle-controller" data-dimmed={isDimmed}>
      Toggle
    </div>
  ),
}))

// Mock applyOutlineUI and ElementInteractionController
vi.mock('@utils/outline', () => ({
  applyOutlineUI: vi.fn(),
  resetPreviouslyAppliedElements: vi.fn(),
}))

vi.mock('@controllers/ElementInteractionController', () => ({
  ElementInteractionController: vi.fn(() => vi.fn()),
}))

describe('RuioUIContainer - Icon Dimming', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // Set ruioEnabled to true so settings modal can render
    localStorage.setItem('ruioEnabled', 'true')
  })

  test('settings icon container has icon-active class when settings is open', async () => {
    render(
      <RuioContextProvider>
        <RuioUIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const settingsButton = settingsContainer.querySelector('button')

    await userEvent.click(settingsButton!)

    expect(settingsContainer.className).toContain(iconStyles['icon-active'])
  })

  test('element select icon container has icon-dimmed class when settings is open', async () => {
    render(
      <RuioContextProvider>
        <RuioUIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const settingsButton = settingsContainer.querySelector('button')

    await userEvent.click(settingsButton!)

    expect(elementSelectContainer.className).toContain(iconStyles['icon-dimmed'])
  })

  test('logo is dimmed when settings icon is clicked', async () => {
    render(
      <RuioContextProvider>
        <RuioUIContainer />
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
        <RuioUIContainer />
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
        <RuioUIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const elementSelectButton = elementSelectContainer.querySelector('button')

    await userEvent.click(elementSelectButton!)

    expect(settingsContainer.className).toContain(iconStyles['icon-dimmed'])
  })

  test('element select icon container has icon-active class when element select mode is active', async () => {
    render(
      <RuioContextProvider>
        <RuioUIContainer />
      </RuioContextProvider>,
    )

    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const elementSelectButton = elementSelectContainer.querySelector('button')

    await userEvent.click(elementSelectButton!)

    expect(elementSelectContainer.className).toContain(iconStyles['icon-active'])
  })

  test('dimming stops when settings modal is closed', async () => {
    render(
      <RuioContextProvider>
        <RuioUIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const settingsButton = settingsContainer.querySelector('button')
    const logo = screen.getByTestId('ruio-toggle-controller')

    // Open settings
    await userEvent.click(settingsButton!)

    expect(logo.getAttribute('data-dimmed')).toBe('true')
    expect(elementSelectContainer.className).toContain(iconStyles['icon-dimmed'])

    // Close settings by clicking the button again (toggles)
    await userEvent.click(settingsButton!)

    expect(logo.getAttribute('data-dimmed')).toBe('false')
    expect(elementSelectContainer.className).not.toContain(iconStyles['icon-dimmed'])
    expect(elementSelectContainer.className).not.toContain(iconStyles['icon-active'])
  })

  test('clicking element select icon twice toggles dimming on and off', async () => {
    render(
      <RuioContextProvider>
        <RuioUIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const elementSelectButton = elementSelectContainer.querySelector('button')
    const logo = screen.getByTestId('ruio-toggle-controller')

    // First click - activate element select mode
    await userEvent.click(elementSelectButton!)

    expect(logo.getAttribute('data-dimmed')).toBe('true')
    expect(settingsContainer.className).toContain(iconStyles['icon-dimmed'])

    // Second click - deactivate element select mode
    await userEvent.click(elementSelectButton!)

    expect(logo.getAttribute('data-dimmed')).toBe('false')
    expect(settingsContainer.className).not.toContain(iconStyles['icon-dimmed'])
    expect(settingsContainer.className).not.toContain(iconStyles['icon-active'])
  })

  test('only one icon can be active at a time', async () => {
    render(
      <RuioContextProvider>
        <RuioUIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const settingsButton = settingsContainer.querySelector('button')
    const elementSelectButton = elementSelectContainer.querySelector('button')

    // Activate settings
    await userEvent.click(settingsButton!)

    expect(settingsContainer.className).toContain(iconStyles['icon-active'])
    expect(elementSelectContainer.className).toContain(iconStyles['icon-dimmed'])

    // Activate element select - settings should close
    await userEvent.click(elementSelectButton!)

    expect(settingsContainer.className).toContain(iconStyles['icon-dimmed'])
    expect(elementSelectContainer.className).toContain(iconStyles['icon-active'])
  })

  test('icon containers have base icon-container class', () => {
    render(
      <RuioContextProvider>
        <RuioUIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const elementSelectContainer = document.getElementById('ruio-element-select-container')!

    expect(settingsContainer.className).toContain(iconStyles['icon-container'])
    expect(elementSelectContainer.className).toContain(iconStyles['icon-container'])
  })

  test('clicking settings when element select is active deactivates element select mode', async () => {
    render(
      <RuioContextProvider>
        <RuioUIContainer />
      </RuioContextProvider>,
    )

    const settingsContainer = document.getElementById('ruio-settings-container')!
    const elementSelectContainer = document.getElementById('ruio-element-select-container')!
    const settingsButton = settingsContainer.querySelector('button')
    const elementSelectButton = elementSelectContainer.querySelector('button')

    // Activate element select mode
    await userEvent.click(elementSelectButton!)

    expect(elementSelectContainer.className).toContain(iconStyles['icon-active'])
    expect(settingsContainer.className).toContain(iconStyles['icon-dimmed'])

    // Click settings - should deactivate element select mode and activate settings
    await userEvent.click(settingsButton!)

    expect(settingsContainer.className).toContain(iconStyles['icon-active'])
    expect(elementSelectContainer.className).toContain(iconStyles['icon-dimmed'])
    expect(elementSelectContainer.className).not.toContain(iconStyles['icon-active'])
  })
})
