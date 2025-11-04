import { render } from '@testing-library/react'
import RuioWrapper from '@components/RuioWrapper'

describe('RuioWrapper', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <RuioWrapper>
        <div>Test Content</div>
      </RuioWrapper>,
    )
    expect(container).toBeInTheDocument()
  })

  it('should render child components', () => {
    const { getByText } = render(
      <RuioWrapper>
        <div>Child Component</div>
      </RuioWrapper>,
    )

    expect(getByText('Child Component')).toBeInTheDocument()
  })

  it('should render the ruio UI container', () => {
    const { getByTestId } = render(
      <RuioWrapper>
        <div>Test</div>
      </RuioWrapper>,
    )

    expect(getByTestId('ruio-ui-container')).toBeInTheDocument()
  })
})
