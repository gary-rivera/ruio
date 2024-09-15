import React from 'react'
import { render } from '@testing-library/react'
import { BorderedComponent } from '@tests/components/BorderedComponent'

describe('BorderedComponent Snapshot Tests', () => {
  test('matches the snapshot when borders are applied', () => {
    const { asFragment } = render(<BorderedComponent depth={2} apply={true} />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('matches the snapshot when borders are not applied', () => {
    const { asFragment } = render(<BorderedComponent depth={2} apply={false} />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('matches the snapshot with depth 0', () => {
    const { asFragment } = render(<BorderedComponent depth={0} apply={true} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
