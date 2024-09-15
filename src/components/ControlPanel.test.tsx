import { render, fireEvent, screen } from '@testing-library/react'
import { useRuioContext } from '@context/RuioContextProvider'
import ControlPanel from './ControlPanel'

jest.mock('@context/RuioContextProvider')

describe('ControlPanel', () => {
  let setDepthMock: jest.Mock
  let setBordersEnabledMock: jest.Mock
  let selectElementModeMock: jest.Mock

  beforeEach(() => {
    setDepthMock = jest.fn()
    setBordersEnabledMock = jest.fn()
    selectElementModeMock = jest.fn()

    // Mock the useRuioContext hook
    ;(useRuioContext as jest.Mock).mockReturnValue({
      depth: 3,
      setDepth: setDepthMock,
      bordersEnabled: false,
      setBordersEnabled: setBordersEnabledMock,
      selectElementMode: selectElementModeMock,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the control panel with default values', () => {
    render(<ControlPanel />)

    expect(screen.getByLabelText('Depth:')).toBeInTheDocument()
    expect(screen.getByLabelText('Depth:')).toHaveValue(3)

    const selectButton = screen.getByText('Select Element')
    const toggleButton = screen.getByText('Enable Borders')

    expect(selectButton).toBeDisabled() // Borders are disabled by default
    expect(toggleButton).toBeInTheDocument()
  })

  it('enables the Select Element button when borders are enabled', () => {
    ;(useRuioContext as jest.Mock).mockReturnValue({
      depth: 3,
      setDepth: setDepthMock,
      bordersEnabled: true, // bordersEnabled is now true
      setBordersEnabled: setBordersEnabledMock,
      selectElementMode: selectElementModeMock,
    })

    render(<ControlPanel />)

    const selectButton = screen.getByText('Select Element')
    expect(selectButton).not.toBeDisabled()
  })

  it('changes the depth value on input change', () => {
    render(<ControlPanel />)

    const depthInput = screen.getByLabelText('Depth:')
    fireEvent.change(depthInput, { target: { value: '5' } })

    expect(setDepthMock).toHaveBeenCalledWith(5)
  })

  it('toggles bordersEnabled when the toggle button is clicked', () => {
    render(<ControlPanel />)

    const toggleButton = screen.getByText('Enable Borders')
    fireEvent.click(toggleButton)

    expect(setBordersEnabledMock).toHaveBeenCalledWith(true) // Should enable borders
  })

  it('calls selectElementMode when Select Element button is clicked', () => {
    ;(useRuioContext as jest.Mock).mockReturnValue({
      depth: 3,
      setDepth: setDepthMock,
      bordersEnabled: true, // bordersEnabled is true
      setBordersEnabled: setBordersEnabledMock,
      selectElementMode: selectElementModeMock,
    })

    render(<ControlPanel />)

    const selectButton = screen.getByText('Select Element')
    fireEvent.click(selectButton)

    expect(selectElementModeMock).toHaveBeenCalled()
  })
})
