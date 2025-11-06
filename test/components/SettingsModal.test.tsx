import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsModal from '@components/settings/SettingsModal'
import { RuioContextProvider } from '@context/RuioContextProvider'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import * as githubIssue from '@utils/githubIssue'

// Mock the utilities
vi.mock('@utils/applyOutlineUI', () => ({
  applyOutlineUI: vi.fn(),
  resetPreviouslyAppliedElements: vi.fn(),
}))

vi.mock('@controllers/ElementInteractionController', () => ({
  ElementInteractionController: vi.fn(() => vi.fn()),
}))

describe('SettingsModal - Report Issue Feature', () => {
  let windowOpenSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('ruioEnabled', 'true')

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
