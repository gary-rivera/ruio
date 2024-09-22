// import { render, screen, fireEvent, cleanup } from '@testing-library/react'
// import { useRuioContext } from '../context/RuioContextProvider'
// import UtilityIcon from './UtilityIcon'
// import { applyBorders } from '../utils/applyBorders'

// jest.mock('../context/RuioContextProvider')

// jest.mock('../utils/applyBorders', () => ({
//   applyBorders: jest.fn(),
// }))

// describe('UtilityIcon', () => {
//   let setRuioEnabledMock: jest.Mock

//   beforeEach(() => {
//     setRuioEnabledMock = jest.fn()
//     ;(useRuioContext as jest.Mock).mockReturnValue({
//       ruioEnabled: false,
//       setRuioEnabled: setRuioEnabledMock,
//       depth: 3,
//     })
//   })

//   afterEach(() => {
//     cleanup() // Ensure that the DOM is cleaned up between tests
//     jest.clearAllMocks() // Clear any mock call history
//   })

//   it('renders the UtilityIcon component without crashing (Smoke Test)', () => {
//     render(<UtilityIcon />)
//     const utilityIcon = screen.getByTestId('ruio-toggle-icon')
//     expect(utilityIcon).toBeInTheDocument()
//   })

//   it('matches the snapshot', () => {
//     const { asFragment } = render(<UtilityIcon />)
//     expect(asFragment()).toMatchSnapshot()
//   })

//   it('applies the correct styles based on ruioEnabled state', () => {
//     render(<UtilityIcon />)
//     const utilityIcon = screen.getByTestId('ruio-toggle-icon')
//     expect(utilityIcon).toHaveStyle({ backgroundColor: 'lightcoral' }) // ruioEnabled: false

//     cleanup() // Ensure no multiple elements in the DOM

//     // Change mock for ruioEnabled = true
//     ;(useRuioContext as jest.Mock).mockReturnValue({
//       ruioEnabled: true,
//       setRuioEnabled: setRuioEnabledMock,
//       depth: 3,
//     })

//     render(<UtilityIcon />)
//     const updatedUtilityIcon = screen.getByTestId('ruio-toggle-icon')
//     expect(updatedUtilityIcon).toHaveStyle({ backgroundColor: 'lightgreen' }) // ruioEnabled: true
//   })

//   it('toggles ruioEnabled state on click', () => {
//     const setRuioEnabledMock = jest.fn()

//     // Initially mock useRuioContext for ruioEnabled = false
//     ;(useRuioContext as jest.Mock).mockReturnValue({
//       ruioEnabled: false,
//       setRuioEnabled: setRuioEnabledMock,
//       depth: 3,
//     })

//     const { getByTestId, rerender } = render(<UtilityIcon />)
//     const utilityIcon = getByTestId('ruio-toggle-icon')

//     // First click: should enable borders (setRuioEnabled(true))
//     fireEvent.click(utilityIcon)
//     expect(setRuioEnabledMock).toHaveBeenCalledWith(true)

//     // Clear the mock to start fresh for the second click
//     setRuioEnabledMock.mockClear()

//     // Re-render the component after updating the mock to simulate ruioEnabled = true
//     ;(useRuioContext as jest.Mock).mockReturnValue({
//       ruioEnabled: true,
//       setRuioEnabled: setRuioEnabledMock,
//       depth: 3,
//     })

//     rerender(<UtilityIcon />) // Ensure the component re-renders with updated state

//     // Second click: should disable borders (setRuioEnabled(false))
//     fireEvent.click(utilityIcon)
//     expect(setRuioEnabledMock).toHaveBeenCalledWith(false)
//   })

//   it('calls applyBorders when ruioEnabled or depth changes', () => {
//     const rootElementMock = document.createElement('div')
//     document.querySelector = jest.fn().mockReturnValue(rootElementMock)

//     render(<UtilityIcon />)

//     expect(applyBorders).toHaveBeenCalledWith(rootElementMock, 3, false)

//     cleanup() // Ensure no multiple elements in the DOM

//     // Simulate a change in the context state
//     ;(useRuioContext as jest.Mock).mockReturnValue({
//       ruioEnabled: true,
//       setRuioEnabled: setRuioEnabledMock,
//       depth: 5,
//     })

//     render(<UtilityIcon />)
//     expect(applyBorders).toHaveBeenCalledWith(rootElementMock, 5, true)
//   })

//   it('does nothing if the root element is not found', () => {
//     document.querySelector = jest.fn().mockReturnValue(null)

//     render(<UtilityIcon />)

//     expect(applyBorders).not.toHaveBeenCalled()
//   })
// })
