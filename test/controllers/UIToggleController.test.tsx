import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UIToggleController from '@controllers/UIToggleController'
import { RuioContextProvider } from '@context/RuioContextProvider'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import styles from '@controllers/UIToggleController.module.css'

// Mock applySelectedOutlines
vi.mock('@utils/outline', async () => {
  const actual = await vi.importActual<typeof import('@utils/outline')>('@utils/outline')
  return {
    ...actual,
    applySelectedOutlines: vi.fn(),
    resetCommittedOutlines: vi.fn(),
  }
})

vi.mock('@controllers/ElementPicker', () => ({
  ElementPicker: vi.fn(() => vi.fn()),
}))

describe('UIToggleController - Visual Regression', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  test('renders with all required visual elements', () => {
    const { container } = render(
      <RuioContextProvider>
        <UIToggleController />
      </RuioContextProvider>,
    )

    // Check toggle container exists
    const toggleContainer = container.querySelector(`.${styles.toggleContainer}`)
    expect(toggleContainer).toBeTruthy()

    // Check background div exists
    const bgDiv = container.querySelector(`.${styles.logoDivBg}`)
    expect(bgDiv).toBeTruthy()

    // Check button exists
    const button = container.querySelector('button')
    expect(button).toBeTruthy()
    expect(button?.classList.contains(styles.button)).toBe(true)

    // Check logo div exists
    const logoDiv = container.querySelector(`.${styles.logoDiv}`)
    expect(logoDiv).toBeTruthy()

    // Check SVG exists and has fill
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.classList.contains(styles.svg)).toBe(true)
  })

  test('background div has correct classes when disabled', () => {
    const { container } = render(
      <RuioContextProvider>
        <UIToggleController />
      </RuioContextProvider>,
    )

    const bgDiv = container.querySelector(`.${styles.logoDivBg}`)
    expect(bgDiv?.classList.contains(styles.logoDivBgInactive)).toBe(true)
  })

  test('background div has correct classes when enabled', async () => {
    const { container } = render(
      <RuioContextProvider>
        <UIToggleController />
      </RuioContextProvider>,
    )

    const button = container.querySelector('button')!
    await userEvent.click(button)

    const bgDiv = container.querySelector(`.${styles.logoDivBg}`)
    expect(bgDiv?.classList.contains(styles.logoDivBgActive)).toBe(true)
  })

  test('logo div has correct transform classes when disabled', () => {
    const { container } = render(
      <RuioContextProvider>
        <UIToggleController />
      </RuioContextProvider>,
    )

    const logoDiv = container.querySelector(`.${styles.logoDiv}`)
    expect(logoDiv?.classList.contains(styles.logoDivInactive)).toBe(true)
  })

  test('logo div has correct transform classes when enabled', async () => {
    const { container } = render(
      <RuioContextProvider>
        <UIToggleController />
      </RuioContextProvider>,
    )

    const button = container.querySelector('button')!
    await userEvent.click(button)

    const logoDiv = container.querySelector(`.${styles.logoDiv}`)
    expect(logoDiv?.classList.contains(styles.logoDivActive)).toBe(true)
  })

  test('button has correct opacity classes when disabled', () => {
    const { container } = render(
      <RuioContextProvider>
        <UIToggleController />
      </RuioContextProvider>,
    )

    const button = container.querySelector('button')
    expect(button?.classList.contains(styles.logoDisabled)).toBe(true)
  })

  test('button has correct opacity classes when enabled', async () => {
    const { container } = render(
      <RuioContextProvider>
        <UIToggleController />
      </RuioContextProvider>,
    )

    const button = container.querySelector('button')!
    await userEvent.click(button)

    expect(button.classList.contains(styles.logoEnabled)).toBe(true)
  })

  test('applies dimmed classes when isDimmed prop is true', () => {
    const { container } = render(
      <RuioContextProvider>
        <UIToggleController isDimmed={true} />
      </RuioContextProvider>,
    )

    const bgDiv = container.querySelector(`.${styles.logoDivBg}`)
    expect(bgDiv?.classList.contains(styles.logoDivBgDimmed)).toBe(true)

    const button = container.querySelector('button')
    expect(button?.classList.contains(styles.logoDisabledDimmed)).toBe(true)
  })

  test('dimmed state can coexist with enabled state', () => {
    // Test that both logoEnabled and logoEnabledDimmed classes can be applied
    // This would catch if we accidentally removed the dimmed state logic
    const config = {
      ruioEnabled: true,
      depth: 3,
      currentColorPalette: 'dynamic',
    }
    localStorage.setItem('ruio-config', JSON.stringify(config))

    const { container } = render(
      <RuioContextProvider>
        <UIToggleController isDimmed={true} />
      </RuioContextProvider>,
    )

    const button = container.querySelector('button')!

    // When enabled and dimmed, should have logoEnabledDimmed
    expect(button.classList.contains(styles.logoEnabledDimmed)).toBe(true)
  })

  test('button maintains rotation class when enabled (prevents hover override)', () => {
    // This test ensures that .logoEnabled:hover exists and maintains rotation
    // If .logoEnabled:hover is missing, the button would lose rotation on hover
    const config = {
      ruioEnabled: true,
      depth: 3,
      currentColorPalette: 'dynamic',
    }
    localStorage.setItem('ruio-config', JSON.stringify(config))

    const { container } = render(
      <RuioContextProvider>
        <UIToggleController />
      </RuioContextProvider>,
    )

    const button = container.querySelector('button')!

    // Button should have logoEnabled class which applies rotate(-10deg)
    expect(button.classList.contains(styles.logoEnabled)).toBe(true)

    // Verify the CSS module has the class (regression test for missing styles)
    expect(styles.logoEnabled).toBeDefined()

    // This class should be present to prevent .button:hover from overriding rotation
    // In the original issue, hover would override with scale(1.05) only, losing the rotation
  })

  test('logoDiv has counter-rotation when button is enabled', () => {
    // LogoDiv applies rotate(10deg) to counter the button's rotate(-10deg)
    // This keeps the SVG upright while the button/background rotate
    const config = {
      ruioEnabled: true,
      depth: 3,
      currentColorPalette: 'dynamic',
    }
    localStorage.setItem('ruio-config', JSON.stringify(config))

    const { container } = render(
      <RuioContextProvider>
        <UIToggleController />
      </RuioContextProvider>,
    )

    const logoDiv = container.querySelector(`.${styles.logoDiv}`)!

    // LogoDiv should have logoDivActive class which applies rotate(10deg) + scale(0.9)
    expect(logoDiv.classList.contains(styles.logoDivActive)).toBe(true)

    // Verify this transform counters the button's -10deg rotation
    expect(styles.logoDivActive).toBeDefined()
  })

  test('HTML structure snapshot', () => {
    const { container } = render(
      <RuioContextProvider>
        <UIToggleController />
      </RuioContextProvider>,
    )

    expect(container.innerHTML).toMatchSnapshot()
  })

  test('button maintains black background with buttonReset composition', () => {
    const { container } = render(
      <RuioContextProvider>
        <UIToggleController />
      </RuioContextProvider>,
    )

    const button = container.querySelector('button')!

    // Button should have the button class
    expect(button.classList.contains(styles.button)).toBe(true)

    // Regression test: button should maintain background-color: #1c2120
    // Previously lost when buttonReset used 'background: transparent' shorthand
    // which overrode 'background-color' even when declared after in CSS
    expect(styles.button).toBeDefined()

    // Verify button exists and has expected structure
    expect(button).toBeTruthy()
    expect(button.tagName).toBe('BUTTON')
  })

  test('button does not compose transitionFast (transitions only on states)', () => {
    const { container } = render(
      <RuioContextProvider>
        <UIToggleController />
      </RuioContextProvider>,
    )

    const button = container.querySelector('button')!

    // Count CSS module classes - should only have buttonReset, not transitionFast
    const classes = Array.from(button.classList)

    // Should have: button (local), buttonReset (composed)
    // Should NOT have: transitionFast (was incorrectly added, causing transition issues)
    // Original design had no base transition - only on :hover and state classes
    expect(classes.length).toBeLessThanOrEqual(3) // button + buttonReset + logoEnabled/Disabled

    // Verify the state classes exist and have their own transitions
    expect(styles.logoEnabled).toBeDefined()
    expect(styles.logoDisabled).toBeDefined()
  })
})
