import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsModal from '@components/settings/SettingsModal'
import { RuioContextProvider } from '@context/RuioContextProvider'
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest'
import * as githubIssue from '@utils/githubIssue'

// Mock the utilities
vi.mock('@utils/outline', async () => {
  const actual = await vi.importActual<typeof import('@utils/outline')>('@utils/outline')
  return {
    ...actual,
    applyOutlineUI: vi.fn(),
    resetPreviouslyAppliedElements: vi.fn(),
  }
})

vi.mock('@controllers/ElementInteractionController', () => ({
  ElementInteractionController: vi.fn(() => vi.fn()),
}))

describe('SettingsModal - Report Issue Feature', () => {
  let windowOpenSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    const config = {
      ruioEnabled: true,
      depth: 3,
      currentColorPalette: 'default',
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
        isElementSelectionModeActive: expect.any(Boolean),
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
    expect(callArgs).toHaveProperty('isElementSelectionModeActive')
  })

  test('generated URL contains environment information', () => {
    const testState: githubIssue.RuioState = {
      ruioEnabled: true,
      depth: 5,
      currentColorPalette: 'default',
      rootElement: null,
      isElementSelectionModeActive: false,
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
    expect(decodedUrl).toContain('**Color Palette:** default')
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
      currentColorPalette: 'default',
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
      currentColorPalette: 'default',
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
      currentColorPalette: 'default',
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
