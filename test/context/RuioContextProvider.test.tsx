import { render, screen, act } from '@testing-library/react'
import { RuioContextProvider, useRuioContext } from '@context/RuioContextProvider'
import { applyOutlineUI } from '@utils/outline'
import { ElementInteractionController } from '@controllers/ElementInteractionController'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { describe, test, expect, beforeEach, vi, Mock } from 'vitest'

// mocks source
vi.mock('@utils/outline', async () => {
  const actual = await vi.importActual<typeof import('@utils/outline')>('@utils/outline')
  return {
    ...actual,
    applyOutlineUI: vi.fn(),
    resetPreviouslyAppliedElements: vi.fn(),
  }
})
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
    maxDepth,
    isElementSelectionModeActive,
    setIsElementSelectionModeActive,
    rootElement,
  } = useRuioContext()

  return (
    <div>
      <div data-testid="ruioEnabled">{ruioEnabled ? 'Enabled' : 'Disabled'}</div>
      <div data-testid="depth">{depth}</div>
      <div data-testid="maxDepth">{maxDepth}</div>
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
      <button data-testid="set-depth-high" onClick={() => setDepth(100)}>
        Set Depth to 100
      </button>
    </div>
  )
}

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
      <RuioContextProvider defaultRootSelector="#non-existent-element">
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
      <RuioContextProvider defaultRootSelector="#non-existent-element">
        <TestComponent />
      </RuioContextProvider>,
    )

    expect(screen.getByTestId('rootElement').textContent).toBe('None')
  })

  test('should not auto-select root element on clean load (no localStorage)', async () => {
    // Clear localStorage to simulate clean load
    localStorage.clear()

    render(
      <RuioContextProvider defaultRootSelector="#non-existent-element">
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
    // Setup localStorage with a saved root selector using unified config
    const config = {
      ruioEnabled: false,
      depth: 3,
      currentColorPalette: 'dynamic',
      rootElementSelector: '#test-root',
    }
    localStorage.setItem('ruio-config', JSON.stringify(config))

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

  // enable if any significant changes to context provider are made but for now suppress due to vitest logs adding noise to test suite
  test('should throw error if useRuioContext is used outside provider', () => {
    // Suppress error output for this expected error test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const TestInvalidComponent = () => {
      useRuioContext()
      return null
    }

    // Verify that rendering without provider throws the expected error
    expect(() => render(<TestInvalidComponent />)).toThrow(
      '[RuioContextProvider] useRuio must be used within RuioProvider',
    )

    spy.mockRestore()
  })

  test('should calculate maxDepth when rootElement is set', async () => {
    // Create a nested DOM structure with 3 levels
    const testRoot = document.createElement('div')
    testRoot.id = 'test-root'
    const level1 = document.createElement('div')
    const level2 = document.createElement('div')
    const level3 = document.createElement('div')

    testRoot.appendChild(level1)
    level1.appendChild(level2)
    level2.appendChild(level3)
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
        <TestComponent />
      </RuioContextProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('maxDepth').textContent).toBe('3')
    })

    document.body.removeChild(testRoot)
    localStorage.clear()
  })

  test('should automatically clamp depth when it exceeds maxDepth', async () => {
    // Create a shallow DOM structure with only 2 levels
    const testRoot = document.createElement('div')
    testRoot.id = 'shallow-root'
    const level1 = document.createElement('div')
    const level2 = document.createElement('div')

    testRoot.appendChild(level1)
    level1.appendChild(level2)
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
        <TestComponent />
      </RuioContextProvider>,
    )

    // Wait for rootElement to be set
    await waitFor(() => {
      expect(screen.getByTestId('rootElement').textContent).toBe('DIV')
    })

    // Try to set depth to 100, which exceeds maxDepth of 2
    const setDepthHighButton = screen.getByTestId('set-depth-high')
    await act(async () => {
      await userEvent.click(setDepthHighButton)
    })

    // Depth should be clamped to maxDepth of 2
    await waitFor(() => {
      expect(screen.getByTestId('depth').textContent).toBe('2')
    })

    document.body.removeChild(testRoot)
    localStorage.clear()
  })

  test('maxDepth defaults to high value when no rootElement is set', () => {
    render(
      <RuioContextProvider defaultRootSelector="#non-existent-element">
        <TestComponent />
      </RuioContextProvider>,
    )

    // When no rootElement is set, maxDepth should be high (100) to allow free setting
    expect(screen.getByTestId('maxDepth').textContent).toBe('100')
  })

  test('should handle edge case where rootElement has no children', async () => {
    const emptyRoot = document.createElement('div')
    emptyRoot.id = 'empty-root'
    document.body.appendChild(emptyRoot)

    const config = {
      ruioEnabled: false,
      depth: 3,
      currentColorPalette: 'dynamic',
      rootElementSelector: '#empty-root',
    }
    localStorage.setItem('ruio-config', JSON.stringify(config))

    render(
      <RuioContextProvider>
        <TestComponent />
      </RuioContextProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('maxDepth').textContent).toBe('0')
    })

    document.body.removeChild(emptyRoot)
    localStorage.clear()
  })
})
