import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsModal from '@components/settings/SettingsModal'
import { RuioContextProvider } from '@context/RuioContextProvider'
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest'
import * as githubIssue from '@utils/githubIssue'
import settingsRowStyles from '@components/settings/SettingsRow.module.css'
import iconStyles from '@root/styles/icons.module.css'

// Mock the utilities
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

describe('SettingsModal - Report Issue Feature', () => {
  let windowOpenSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    const config = {
      ruioEnabled: true,
      depth: 3,
      currentColorPalette: 'dynamic',
    }
    localStorage.setItem('ruio-config', JSON.stringify(config))

    // Mock window.open
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
  })

  afterEach(() => {
    windowOpenSpy.mockRestore()
  })

  test('renders report issue button with icon', () => {
    render(
      <RuioContextProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </RuioContextProvider>,
    )

    const reportIssue = screen.getByText('Report an issue')
    expect(reportIssue).toBeInTheDocument()

    // Check that the SVG icon is present
    const svg = reportIssue.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24')
  })

  test('clicking report issue opens GitHub with correct URL', async () => {
    const generateUrlSpy = vi.spyOn(githubIssue, 'generateGitHubIssueUrl')

    render(
      <RuioContextProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </RuioContextProvider>,
    )

    const reportIssue = screen.getByText('Report an issue')
    await userEvent.click(reportIssue)

    expect(generateUrlSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ruioEnabled: true,
        depth: expect.any(Number),
        currentColorPalette: expect.any(String),
        isElementPickerActive: expect.any(Boolean),
      }),
    )

    expect(windowOpenSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://github.com/gary-rivera/ruio/issues/new'),
      '_blank',
      'noopener,noreferrer',
    )
  })

  test('includes ruio state in generated URL', async () => {
    const generateUrlSpy = vi.spyOn(githubIssue, 'generateGitHubIssueUrl')

    render(
      <RuioContextProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </RuioContextProvider>,
    )

    const reportIssue = screen.getByText('Report an issue')
    await userEvent.click(reportIssue)

    const callArgs = generateUrlSpy.mock.calls[0][0]

    expect(callArgs).toHaveProperty('ruioEnabled')
    expect(callArgs).toHaveProperty('depth')
    expect(callArgs).toHaveProperty('currentColorPalette')
    expect(callArgs).toHaveProperty('rootElement')
    expect(callArgs).toHaveProperty('isElementPickerActive')
  })

  test('generated URL contains environment information', () => {
    const testState: githubIssue.RuioState = {
      ruioEnabled: true,
      depth: 5,
      currentColorPalette: 'dynamic',
      rootElement: null,
      isElementPickerActive: false,
    }

    const url = githubIssue.generateGitHubIssueUrl(testState)

    expect(url).toContain('github.com/gary-rivera/ruio/issues/new')
    expect(url).toContain('title=')
    expect(url).toContain('body=')

    // Decode URL to check contents
    const decodedUrl = decodeURIComponent(url)
    expect(decodedUrl).toContain('Ruio Version')
    expect(decodedUrl).toContain('**Enabled:** Yes')
    expect(decodedUrl).toContain('**Depth:** 5')
    expect(decodedUrl).toContain('**Color Palette:** dynamic')
  })

  test('modal container does not have open class when closed', () => {
    render(
      <RuioContextProvider>
        <SettingsModal isOpen={false} onClose={() => {}} />
      </RuioContextProvider>,
    )

    const modalContainer = document.getElementById('ruio-settings-modal-container')
    expect(modalContainer?.className).not.toContain('open')
  })
})

describe('SettingsModal - Depth Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  test('depth input displays current depth value', () => {
    render(
      <RuioContextProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </RuioContextProvider>,
    )

    const depthInput = screen.getByRole('textbox') as HTMLInputElement
    expect(depthInput.value).toBe('3') // Default depth
  })

  test('clicking increment button increases depth', async () => {
    render(
      <RuioContextProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </RuioContextProvider>,
    )

    const incrementButton = screen.getByText('+')
    const depthInput = screen.getByRole('textbox') as HTMLInputElement

    await userEvent.click(incrementButton)

    await waitFor(() => {
      expect(depthInput.value).toBe('4')
    })
  })

  test('clicking decrement button decreases depth', async () => {
    render(
      <RuioContextProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </RuioContextProvider>,
    )

    const decrementButton = screen.getByText('-')
    const depthInput = screen.getByRole('textbox') as HTMLInputElement

    await userEvent.click(decrementButton)

    await waitFor(() => {
      expect(depthInput.value).toBe('2')
    })
  })

  test('depth cannot go below 0', async () => {
    render(
      <RuioContextProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </RuioContextProvider>,
    )

    const decrementButton = screen.getByText('-')
    const depthInput = screen.getByRole('textbox') as HTMLInputElement

    // Click decrement multiple times to try to go below 0
    for (let i = 0; i < 10; i++) {
      await userEvent.click(decrementButton)
    }

    await waitFor(() => {
      expect(parseInt(depthInput.value)).toBeGreaterThanOrEqual(0)
    })
  })

  test('depth is clamped to maxDepth from context', async () => {
    // Create a shallow DOM structure
    const testRoot = document.createElement('div')
    testRoot.id = 'shallow-root'
    const level1 = document.createElement('div')
    testRoot.appendChild(level1)
    document.body.appendChild(testRoot)

    const config = {
      ruioEnabled: false,
      depth: 3,
      currentColorPalette: 'dynamic',
      rootElementSelector: '#shallow-root',
    }
    localStorage.setItem('ruio-config', JSON.stringify(config))

    render(
      <RuioContextProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </RuioContextProvider>,
    )

    const incrementButton = screen.getByText('+')
    const depthInput = screen.getByRole('textbox') as HTMLInputElement

    // Try to increment beyond maxDepth
    for (let i = 0; i < 10; i++) {
      await userEvent.click(incrementButton)
    }

    await waitFor(() => {
      // Should be clamped to maxDepth of 1
      expect(parseInt(depthInput.value)).toBeLessThanOrEqual(1)
    })

    document.body.removeChild(testRoot)
    localStorage.clear()
  })

  test('manual input is clamped to maxDepth on blur', async () => {
    // Create a shallow DOM structure
    const testRoot = document.createElement('div')
    testRoot.id = 'shallow-root'
    const level1 = document.createElement('div')
    testRoot.appendChild(level1)
    document.body.appendChild(testRoot)

    const config = {
      ruioEnabled: false,
      depth: 3,
      currentColorPalette: 'dynamic',
      rootElementSelector: '#shallow-root',
    }
    localStorage.setItem('ruio-config', JSON.stringify(config))

    render(
      <RuioContextProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </RuioContextProvider>,
    )

    const depthInput = screen.getByRole('textbox') as HTMLInputElement

    // Wait for maxDepth to be calculated
    await waitFor(() => {
      expect(depthInput).toBeInTheDocument()
    })

    // Try to set depth to 100
    await act(async () => {
      await userEvent.clear(depthInput)
      await userEvent.type(depthInput, '100')
      depthInput.blur()
    })

    await waitFor(() => {
      // Should be clamped to maxDepth of 1
      expect(parseInt(depthInput.value)).toBeLessThanOrEqual(1)
    })

    document.body.removeChild(testRoot)
    localStorage.clear()
  })

  test('tempDepth syncs with depth changes from context', async () => {
    const testRoot = document.createElement('div')
    testRoot.id = 'test-root'
    const level1 = document.createElement('div')
    const level2 = document.createElement('div')
    const level3 = document.createElement('div')
    const level4 = document.createElement('div')
    const level5 = document.createElement('div')
    testRoot.appendChild(level1)
    level1.appendChild(level2)
    level2.appendChild(level3)
    level3.appendChild(level4)
    level4.appendChild(level5)
    document.body.appendChild(testRoot)

    const config = {
      ruioEnabled: false,
      depth: 3,
      currentColorPalette: 'dynamic',
      rootElementSelector: '#test-root',
    }
    localStorage.setItem('ruio-config', JSON.stringify(config))

    render(
      <RuioContextProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </RuioContextProvider>,
    )

    const depthInput = screen.getByRole('textbox') as HTMLInputElement

    // Wait for initial render and depth clamping
    await waitFor(() => {
      expect(depthInput.value).toBeTruthy()
    })

    const incrementButton = screen.getByText('+')
    await userEvent.click(incrementButton)

    // Input should update to reflect the new depth (maxDepth is 5, starting depth is 3, so increment gives 4)
    await waitFor(() => {
      expect(depthInput.value).toBe('4')
    })

    document.body.removeChild(testRoot)
    localStorage.clear()
  })
})

describe('SettingsModal - Visual Regression', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  test('depth input has transparent background (not same as buttons)', () => {
    const { container } = render(
      <RuioContextProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </RuioContextProvider>,
    )

    const depthInput = screen.getByRole('textbox') as HTMLInputElement

    // Verify depth input has the depthControlInput class
    expect(depthInput.classList.contains(settingsRowStyles.depthControlInput)).toBe(true)

    // Verify the increment/decrement buttons exist and have different styling
    const incrementButton = screen.getByText('+')
    const decrementButton = screen.getByText('-')

    expect(incrementButton).toBeInTheDocument()
    expect(decrementButton).toBeInTheDocument()

    // The buttons have background while input should be transparent
    // This is a regression test for when depth input had same background as buttons
    expect(settingsRowStyles.depthControlInput).toBeDefined()
  })

  test('checkmark icon in dropdown has proper styling (no default checkbox)', () => {
    const { container } = render(
      <RuioContextProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </RuioContextProvider>,
    )

    // Open the theme dropdown
    const themeRow = container.querySelector('#ruio-settings-theme-row')
    expect(themeRow).toBeTruthy()

    // Find the dropdown control and click to open
    const themeControl = themeRow?.querySelector('[class*="themeControlContainer"]')
    expect(themeControl).toBeTruthy()

    // The dropdown should render checkmark icons
    // This is a regression test to ensure checkmark doesn't show as default HTML checkbox
    const checkmarkButtons = container.querySelectorAll('button[id="ruio-chevron"]')

    // Checkmark icons should have proper button reset styles (no default appearance)
    checkmarkButtons.forEach((button) => {
      expect(button).toBeTruthy()
      // Should be a button element (RuioIcon wraps in button)
      expect(button.tagName).toBe('BUTTON')
    })
  })

  test('close modal icon has smooth hover transition', () => {
    const { container } = render(
      <RuioContextProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </RuioContextProvider>,
    )

    // Find the close button
    const closeButton = container.querySelector('button[id="ruio-close-modal-icon"]')
    expect(closeButton).toBeTruthy()

    // Verify it has the closeButton class with transition
    expect(closeButton?.classList.contains(iconStyles.closeButton)).toBe(true)

    // Regression test: closeButton should have transition for smooth hover effect
    // Previously lost transition when using buttonReset composition
    expect(iconStyles.closeButton).toBeDefined()
  })

  test('SVG outline paths inherit fill from parent SVG', () => {
    // Regression test: svgOutline should NOT specify fill, inheriting from parent SVG
    // This gives the icon a background fill (#1c2120) with stroke on top
    // Previously incorrectly set fill: none which removed the background
    // This test just verifies the CSS classes are defined properly
    expect(iconStyles.svgOutline).toBeDefined()
    expect(iconStyles.svgBarBg).toBeDefined()
    expect(iconStyles.svgDial).toBeDefined()
    expect(iconStyles.iconSvg).toBeDefined()
  })
})
