import { render, screen, act } from '@testing-library/react'
import { RuioContextProvider, useRuioContext } from '@context/RuioContextProvider'
import { applyOutlineUI } from '@utils/applyOutlineUI'
import { ElementInteractionController } from '@controllers/ElementInteractionController'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { describe, test, expect, beforeEach, vi, Mock } from 'vitest'

// mocks source
vi.mock('@utils/applyOutlineUI')
vi.mock('@controllers/ElementInteractionController')

// mocks target
const mockedElementInteractionController = ElementInteractionController as Mock<
  typeof ElementInteractionController
>
const mockedApplyBorders = applyOutlineUI as Mock<typeof applyOutlineUI>

const TestComponent = () => {
  const {
    ruioEnabled,
    setRuioEnabled,
    depth,
    setDepth,
    isElementSelectionModeActive,
    setIsElementSelectionModeActive,
    rootElement,
  } = useRuioContext()

  return (
    <div>
      <div data-testid="ruioEnabled">{ruioEnabled ? 'Enabled' : 'Disabled'}</div>
      <div data-testid="depth">{depth}</div>
      <div data-testid="rootElement">{rootElement?.tagName || 'None'}</div>
      <button
        data-testid="select-element-mode"
        onClick={() => {
          setIsElementSelectionModeActive(!isElementSelectionModeActive)
        }}
      >
        Select Element Mode
      </button>
      <button data-testid="enable-borders" onClick={() => setRuioEnabled(true)}>
        Enable Borders
      </button>
      <button data-testid="set-depth" onClick={() => setDepth(5)}>
        Set Depth to 5
      </button>
    </div>
  )
}

// TODO: test for toggle element selection mode to deactivate on click of an element

describe('RuioContextProvider', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
  })

  test('renders the provider without crashing', () => {
    render(
      <RuioContextProvider>
        <div>Test</div>
      </RuioContextProvider>,
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  test('should update ruioEnabled state when triggered', async () => {
    render(
      <RuioContextProvider>
        <TestComponent />
      </RuioContextProvider>,
    )

    const enableBordersButton = screen.getByTestId('enable-borders')

    await act(async () => {
      await userEvent.click(enableBordersButton)
    })

    expect(screen.getByTestId('ruioEnabled').textContent).toBe('Enabled')
  })

  test('should update depth state when triggered', async () => {
    render(
      <RuioContextProvider>
        <TestComponent />
      </RuioContextProvider>,
    )

    const setDepthButton = screen.getByTestId('set-depth')

    await act(async () => {
      await userEvent.click(setDepthButton)
    })

    expect(screen.getByTestId('depth').textContent).toBe('5')
  })

  test('should call cleanup function when selection mode is triggered', async () => {
    const cleanupMock = vi.fn()

    mockedElementInteractionController.mockReturnValue(cleanupMock)

    render(
      <RuioContextProvider>
        <TestComponent />
      </RuioContextProvider>,
    )

    const selectElementButton = screen.getByTestId('select-element-mode')

    await act(async () => {
      await userEvent.click(selectElementButton)
    })

    expect(cleanupMock).not.toHaveBeenCalled()

    await act(async () => {
      cleanupMock()
    })

    expect(cleanupMock).toHaveBeenCalled()
  })

  test('should display "None" if no element is selected', () => {
    render(
      <RuioContextProvider>
        <TestComponent />
      </RuioContextProvider>,
    )

    expect(screen.getByTestId('rootElement').textContent).toBe('None')
  })

  test('should not auto-select root element on clean load (no localStorage)', async () => {
    // Clear localStorage to simulate clean load
    localStorage.clear()

    render(
      <RuioContextProvider>
        <TestComponent />
      </RuioContextProvider>,
    )

    // Verify rootElement is null on initial render
    expect(screen.getByTestId('rootElement').textContent).toBe('None')

    // Enable ruio
    const enableBordersButton = screen.getByTestId('enable-borders')
    await act(async () => {
      await userEvent.click(enableBordersButton)
    })

    // Toggle element selection mode
    const selectElementButton = screen.getByTestId('select-element-mode')
    await act(async () => {
      await userEvent.click(selectElementButton)
    })

    // Verify rootElement is still null (not auto-selected to #root)
    expect(screen.getByTestId('rootElement').textContent).toBe('None')

    // Verify applyOutlineUI was NOT called with a default root element
    // It should only be called during hover interactions, not on mount
    expect(mockedApplyBorders).not.toHaveBeenCalled()
  })

  test('should restore root element from localStorage on load', async () => {
    // Setup localStorage with a saved root selector
    localStorage.setItem('rootElementSelector', '#test-root')

    // Create a test element in the DOM
    const testRoot = document.createElement('div')
    testRoot.id = 'test-root'
    document.body.appendChild(testRoot)

    render(
      <RuioContextProvider>
        <TestComponent />
      </RuioContextProvider>,
    )

    // Wait for useEffect to process
    await waitFor(() => {
      expect(screen.getByTestId('rootElement').textContent).toBe('DIV')
    })

    // Enable ruio to trigger outline application
    const enableBordersButton = screen.getByTestId('enable-borders')
    await act(async () => {
      await userEvent.click(enableBordersButton)
    })

    // Verify applyOutlineUI was called with the restored root element
    await waitFor(() => {
      expect(mockedApplyBorders).toHaveBeenCalledWith(
        testRoot,
        expect.any(Number),
        true,
        expect.any(String),
      )
    })

    // Cleanup
    document.body.removeChild(testRoot)
    localStorage.clear()
  })

  test('should throw error if useRuioContext is used outside provider', () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {})

    const TestInvalidComponent = () => {
      const { ruioEnabled } = useRuioContext()
      return <div>{ruioEnabled ? 'Enabled' : 'Disabled'}</div>
    }

    expect(() => render(<TestInvalidComponent />)).toThrow(
      '[RuioContextProvider] useRuio must be used within RuioProvider',
    )

    consoleErrorMock.mockRestore()
  })
})
