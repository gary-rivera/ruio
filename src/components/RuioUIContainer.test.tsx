import { render, fireEvent, screen } from '@testing-library/react'
import { useRuioContext } from '@context/RuioContextProvider'
import RuioUIContainer from './RuioUIContainer'

jest.mock('@context/RuioContextProvider')

describe('RuioUIContainer', () => {
  let setDepthMock: jest.Mock
  let setRuioEnabledMock: jest.Mock
  let toggleElementSelectionModeMock: jest.Mock

  beforeEach(() => {
    setDepthMock = jest.fn()
    setRuioEnabledMock = jest.fn()
    toggleElementSelectionModeMock = jest.fn()
    ;(useRuioContext as jest.Mock).mockReturnValue({
      depth: 3,
      setDepth: setDepthMock,
      ruioEnabled: false,
      setRuioEnabled: setRuioEnabledMock,
      toggleElementSelectionMode: toggleElementSelectionModeMock,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('matches the snapshot', () => {
    const { asFragment } = render(<RuioUIContainer />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders the RuioUIContainer without crashing (Smoke Test)', () => {
    render(<RuioUIContainer />)
    expect(screen.getByLabelText('Depth:')).toBeInTheDocument()
  })

  it('renders the control panel with default values', () => {
    render(<RuioUIContainer />)

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
      ruioEnabled: true, // ruioEnabled is now true
      setRuioEnabled: setRuioEnabledMock,
      toggleElementSelectionMode: toggleElementSelectionModeMock,
    })

    render(<RuioUIContainer />)

    const selectButton = screen.getByText('Select Element')
    expect(selectButton).not.toBeDisabled()
  })

  it('changes the depth value on input change', () => {
    render(<RuioUIContainer />)

    const depthInput = screen.getByLabelText('Depth:')
    fireEvent.change(depthInput, { target: { value: '5' } })

    expect(setDepthMock).toHaveBeenCalledWith(5)
  })

  it('toggles ruioEnabled when the toggle button is clicked', () => {
    render(<RuioUIContainer />)

    const toggleButton = screen.getByText('Enable Borders')
    fireEvent.click(toggleButton)

    expect(setRuioEnabledMock).toHaveBeenCalledWith(true) // Should enable borders
  })

  it('calls toggleElementSelectionMode when Select Element button is clicked', () => {
    ;(useRuioContext as jest.Mock).mockReturnValue({
      depth: 3,
      setDepth: setDepthMock,
      ruioEnabled: true, // ruioEnabled is true
      setRuioEnabled: setRuioEnabledMock,
      toggleElementSelectionMode: toggleElementSelectionModeMock,
    })

    render(<RuioUIContainer />)

    const selectButton = screen.getByText('Select Element')
    fireEvent.click(selectButton)

    expect(toggleElementSelectionModeMock).toHaveBeenCalled()
  })
})
