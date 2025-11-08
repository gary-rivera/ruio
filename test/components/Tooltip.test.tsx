import { render } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { Tooltip } from '@components/Tooltip'

describe('Tooltip', () => {
  test('renders with children at specified position', () => {
    const { container } = render(
      <Tooltip x={100} y={200}>
        <div>Test content</div>
      </Tooltip>,
    )

    const tooltip = container.querySelector('[class*="tooltip"]')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveTextContent('Test content')
    expect(tooltip).toHaveStyle({ left: '100px', top: '200px' })
  })

  test('applies custom styles', () => {
    const { container } = render(
      <Tooltip x={0} y={0} style={{ transform: 'none', opacity: 0.5 }}>
        <span>Content</span>
      </Tooltip>,
    )

    const tooltip = container.querySelector('[class*="tooltip"]')
    expect(tooltip).toHaveStyle({ transform: 'none', opacity: '0.5' })
  })

  test('applies custom className', () => {
    const { container } = render(
      <Tooltip x={0} y={0} className="custom-class">
        <span>Content</span>
      </Tooltip>,
    )

    const tooltip = container.querySelector('[class*="tooltip"]')
    expect(tooltip?.className).toContain('custom-class')
  })

  test('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }

    render(
      <Tooltip ref={ref} x={0} y={0}>
        <span>Content</span>
      </Tooltip>,
    )

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveTextContent('Content')
  })

  test('updates position when props change', () => {
    const { container, rerender } = render(
      <Tooltip x={10} y={20}>
        <span>Content</span>
      </Tooltip>,
    )

    let tooltip = container.querySelector('[class*="tooltip"]')
    expect(tooltip).toHaveStyle({ left: '10px', top: '20px' })

    rerender(
      <Tooltip x={50} y={100}>
        <span>Content</span>
      </Tooltip>,
    )

    tooltip = container.querySelector('[class*="tooltip"]')
    expect(tooltip).toHaveStyle({ left: '50px', top: '100px' })
  })
})
