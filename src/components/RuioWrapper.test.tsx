import React from 'react'
import { render } from '@testing-library/react'
import RuioWrapper from './RuioWrapper'

describe('RuioWrapper Smoke Tests', () => {
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
})

describe('RuioWrapper Snapshot Tests', () => {
  it('should match the snapshot with default children', () => {
    const { asFragment } = render(
      <RuioWrapper>
        <div>Snapshot Child</div>
      </RuioWrapper>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

describe('RuioWrapper Edge Cases', () => {
  it('should always render UtilityIcon and ControlPanel', () => {
    const { getByTestId } = render(
      <RuioWrapper>
        <div>Some Child</div>
      </RuioWrapper>,
    )

    expect(getByTestId('utility-icon')).toBeInTheDocument()
    expect(getByTestId('control-panel')).toBeInTheDocument()
  })

  it('should render without children', () => {
    const { container } = render(
      <RuioWrapper>
        <> </>
      </RuioWrapper>,
    )
    expect(container).toBeInTheDocument()
  })

  it('should render correctly with invalid children types', () => {
    const { container } = render(<RuioWrapper>{null}</RuioWrapper>)
    expect(container).toBeInTheDocument()
  })
})
