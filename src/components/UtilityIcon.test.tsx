import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { useRuioContext } from '../context/RuioContextProvider'
import UtilityIcon from './UtilityIcon'
import { applyBorders } from '../utils/applyBorders'

jest.mock('../context/RuioContextProvider')

jest.mock('../utils/applyBorders', () => ({
  applyBorders: jest.fn(),
}))

describe('UtilityIcon', () => {
  let setBordersEnabledMock: jest.Mock

  beforeEach(() => {
    setBordersEnabledMock = jest.fn()
    ;(useRuioContext as jest.Mock).mockReturnValue({
      bordersEnabled: false,
      setBordersEnabled: setBordersEnabledMock,
      depth: 3,
    })
  })

  afterEach(() => {
    cleanup() // Ensure that the DOM is cleaned up between tests
    jest.clearAllMocks() // Clear any mock call history
  })

  it('renders the UtilityIcon component', () => {
    render(<UtilityIcon />)

    const utilityIcon = screen.getByTestId('utility-icon')
    expect(utilityIcon).toBeInTheDocument()
  })

  it('applies the correct styles based on bordersEnabled state', () => {
    render(<UtilityIcon />)
    const utilityIcon = screen.getByTestId('utility-icon')
    expect(utilityIcon).toHaveStyle({ backgroundColor: 'lightcoral' }) // bordersEnabled: false

    cleanup() // Ensure no multiple elements in the DOM

    // Change mock for bordersEnabled = true
    ;(useRuioContext as jest.Mock).mockReturnValue({
      bordersEnabled: true,
      setBordersEnabled: setBordersEnabledMock,
      depth: 3,
    })

    render(<UtilityIcon />)
    const updatedUtilityIcon = screen.getByTestId('utility-icon')
    expect(updatedUtilityIcon).toHaveStyle({ backgroundColor: 'lightgreen' }) // bordersEnabled: true
  })

  it('toggles bordersEnabled state on click', () => {
    const setBordersEnabledMock = jest.fn()

    // Initially mock useRuioContext for bordersEnabled = false
    ;(useRuioContext as jest.Mock).mockReturnValue({
      bordersEnabled: false,
      setBordersEnabled: setBordersEnabledMock,
      depth: 3,
    })

    const { getByTestId, rerender } = render(<UtilityIcon />)
    const utilityIcon = getByTestId('utility-icon')

    // First click: should enable borders (setBordersEnabled(true))
    fireEvent.click(utilityIcon)
    expect(setBordersEnabledMock).toHaveBeenCalledWith(true)

    // Clear the mock to start fresh for the second click
    setBordersEnabledMock.mockClear()

    // Re-render the component after updating the mock to simulate bordersEnabled = true
    ;(useRuioContext as jest.Mock).mockReturnValue({
      bordersEnabled: true,
      setBordersEnabled: setBordersEnabledMock,
      depth: 3,
    })

    rerender(<UtilityIcon />) // Ensure the component re-renders with updated state

    // Second click: should disable borders (setBordersEnabled(false))
    fireEvent.click(utilityIcon)
    expect(setBordersEnabledMock).toHaveBeenCalledWith(false)
  })

  it('calls applyBorders when bordersEnabled or depth changes', () => {
    const rootElementMock = document.createElement('div')
    document.querySelector = jest.fn().mockReturnValue(rootElementMock)

    render(<UtilityIcon />)

    expect(applyBorders).toHaveBeenCalledWith(rootElementMock, 3, false)

    cleanup() // Ensure no multiple elements in the DOM

    // Simulate a change in the context state
    ;(useRuioContext as jest.Mock).mockReturnValue({
      bordersEnabled: true,
      setBordersEnabled: setBordersEnabledMock,
      depth: 5,
    })

    render(<UtilityIcon />)
    expect(applyBorders).toHaveBeenCalledWith(rootElementMock, 5, true)
  })

  it('does nothing if the root element is not found', () => {
    document.querySelector = jest.fn().mockReturnValue(null)

    render(<UtilityIcon />)

    expect(applyBorders).not.toHaveBeenCalled()
  })
})
