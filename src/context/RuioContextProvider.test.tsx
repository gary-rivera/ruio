import { render, screen } from '@testing-library/react'
import { RuioContextProvider, useRuioContext } from './RuioContextProvider'
import { applyBorders } from '../utils/applyBorders'
import { ElementInteractionController } from '../controllers/ElementInteractionController'
import userEvent from '@testing-library/user-event'

// mocks source
jest.mock('../utils/applyBorders')
jest.mock('../controllers/ElementInteractionController')

// mocks target
const mockedElementInteractionController = ElementInteractionController as jest.MockedFunction<
  typeof ElementInteractionController
>
const mockedApplyBorders = applyBorders as jest.MockedFunction<typeof applyBorders>

const TestComponent = () => {
  const { bordersEnabled, setBordersEnabled, depth, setDepth, selectElementMode, selectedElement } =
    useRuioContext()

  return (
    <div>
      <div data-testid="bordersEnabled">{bordersEnabled ? 'Enabled' : 'Disabled'}</div>
      <div data-testid="depth">{depth}</div>
      <div data-testid="selectedElement">{selectedElement?.tagName || 'None'}</div>
      <button onClick={() => setBordersEnabled(true)}>Enable Borders</button>
      <button onClick={() => setDepth(5)}>Set Depth to 5</button>
      <button onClick={selectElementMode}>Select Element Mode</button>
    </div>
  )
}

describe('RuioContextProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks() // Reset mocks before each test
  })

  test('should trigger element selection mode and call ElementInteractionController', () => {
    const cleanupMock = jest.fn()
    const mockElement = document.createElement('div')

    // Mock the return value of ElementInteractionController
    mockedElementInteractionController.mockReturnValue(cleanupMock)

    render(
      <RuioContextProvider>
        <TestComponent />
      </RuioContextProvider>,
    )

    const selectElementButton = screen.getByText('Select Element Mode')
    userEvent.click(selectElementButton)

    // Simulate the callback
    const callback = mockedElementInteractionController.mock.calls[0][0]
    callback(mockElement)

    expect(mockedElementInteractionController).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('selectedElement').textContent).toBe(mockElement.tagName)
  })

  test('should call applyBorders when element is selected and borders are enabled', () => {
    const mockElement = document.createElement('div')
    mockedElementInteractionController.mockImplementation((callback: (element: HTMLElement) => void) => {
      callback(mockElement)
      return jest.fn() // Mock cleanup function
    })

    render(
      <RuioContextProvider>
        <TestComponent />
      </RuioContextProvider>,
    )

    const enableBordersButton = screen.getByText('Enable Borders')
    userEvent.click(enableBordersButton)

    const selectElementButton = screen.getByText('Select Element Mode')
    userEvent.click(selectElementButton)

    expect(mockedApplyBorders).toHaveBeenCalledWith(mockElement, 1, true)
  })
})
