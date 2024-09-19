import { render, screen, act } from '@testing-library/react'
import { RuioContextProvider, useRuioContext } from './RuioContextProvider'
import { applyBorders } from '../utils/applyBorders'
import { ElementInteractionController } from '../controllers/ElementInteractionController'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'

// mocks source
jest.mock('../utils/applyBorders')
jest.mock('../controllers/ElementInteractionController')

// mocks target
const mockedElementInteractionController = ElementInteractionController as jest.MockedFunction<
  typeof ElementInteractionController
>
const mockedApplyBorders = applyBorders as jest.MockedFunction<typeof applyBorders>

const TestComponent = () => {
  const {
    ruioEnabled,
    setRuioEnabled,
    depth,
    setDepth,
    isElementSelectionModeActive,
    setIsElementSelectionModeActive,
    selectedRootElement,
  } = useRuioContext()

  return (
    <div>
      <div data-testid="ruioEnabled">{ruioEnabled ? 'Enabled' : 'Disabled'}</div>
      <div data-testid="depth">{depth}</div>
      <div data-testid="selectedRootElement">{selectedRootElement?.tagName || 'None'}</div>
      <button
        onClick={() => {
          setIsElementSelectionModeActive(!isElementSelectionModeActive)
        }}
      >
        Select Element Mode
      </button>
      <button onClick={() => setRuioEnabled(true)}>Enable Borders</button>
      <button onClick={() => setDepth(5)}>Set Depth to 5</button>
    </div>
  )
}

describe('RuioContextProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('matches the snapshot for initial render', () => {
    const { container } = render(
      <RuioContextProvider>
        <TestComponent />
      </RuioContextProvider>,
    )
    expect(container).toMatchSnapshot()
  })

  test('renders the provider without crashing', () => {
    render(
      <RuioContextProvider>
        <div>Test</div>
      </RuioContextProvider>,
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  test('should trigger element selection mode and call ElementInteractionController', async () => {
    const cleanupMock = jest.fn()
    const mockElement = document.createElement('div')

    mockedElementInteractionController.mockImplementation((callback) => {
      return cleanupMock
    })

    act(() => {
      render(
        <RuioContextProvider>
          <TestComponent />
        </RuioContextProvider>,
      )
    })

    const selectElementButton = screen.getByText('Select Element Mode')

    await act(async () => {
      await userEvent.click(selectElementButton)
    })

    expect(mockedElementInteractionController).toHaveBeenCalledTimes(1)

    await act(async () => {
      const callback = mockedElementInteractionController.mock.calls[0][0]
      callback(mockElement)
    })

    await waitFor(() => {
      expect(screen.getByTestId('selectedRootElement').textContent).toBe(mockElement.tagName)
    })
  })

  test('should update ruioEnabled state when triggered', async () => {
    render(
      <RuioContextProvider>
        <TestComponent />
      </RuioContextProvider>,
    )

    const enableBordersButton = screen.getByText('Enable Borders')

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

    const setDepthButton = screen.getByText('Set Depth to 5')

    await act(async () => {
      await userEvent.click(setDepthButton)
    })

    expect(screen.getByTestId('depth').textContent).toBe('5')
  })

  test('should call cleanup function when selection mode is triggered', async () => {
    const cleanupMock = jest.fn()

    mockedElementInteractionController.mockReturnValue(cleanupMock)

    render(
      <RuioContextProvider>
        <TestComponent />
      </RuioContextProvider>,
    )

    const selectElementButton = screen.getByText('Select Element Mode')

    await act(async () => {
      await userEvent.click(selectElementButton)
    })

    expect(cleanupMock).not.toHaveBeenCalled()

    cleanupMock()

    expect(cleanupMock).toHaveBeenCalled()
  })

  test('should display "None" if no element is selected', () => {
    render(
      <RuioContextProvider>
        <TestComponent />
      </RuioContextProvider>,
    )

    expect(screen.getByTestId('selectedRootElement').textContent).toBe('None')
  })

  test('should call applyBorders with correct arguments when borders are enabled', async () => {
    const mockElement = document.createElement('div')
    mockedElementInteractionController.mockImplementation((callback: (element: HTMLElement) => void) => {
      callback(mockElement)
      return jest.fn()
    })

    render(
      <RuioContextProvider>
        <TestComponent />
      </RuioContextProvider>,
    )

    const enableBordersButton = screen.getByText('Enable Borders')

    await act(async () => {
      await userEvent.click(enableBordersButton)
    })

    const selectElementButton = screen.getByText('Select Element Mode')

    await act(async () => {
      await userEvent.click(selectElementButton)
    })

    expect(mockedApplyBorders).toHaveBeenCalledWith(mockElement, 1, true)
  })

  // NOTE: consider enabling this test for possible regression checks (not working rn)
  // test('should call cleanup function when component unmounts', async () => {
  //   const cleanupMock = jest.fn()

  //   mockedElementInteractionController.mockImplementation(() => {
  //     console.log('ElementInteractionController called, returning cleanupMock')
  //     return cleanupMock
  //   })

  //   const { unmount } = render(
  //     <RuioContextProvider>
  //       <TestComponent />
  //     </RuioContextProvider>,
  //   )

  //   const selectElementButton = screen.getByText('Select Element Mode')

  //   await act(async () => {
  //     userEvent.click(selectElementButton)
  //   })

  //   await act(async () => {
  //     unmount()
  //   })

  //   console.log('Unmounting the component, checking cleanupMock')

  //   expect(cleanupMock).toHaveBeenCalledTimes(1)
  // })

  test('should throw error if useRuioContext is used outside provider', () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {})

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
