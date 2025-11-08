import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ElementSelectionTooltip } from '@components/ElementSelectionTooltip'
import type { TooltipData } from '@hooks/useElementSelection'

describe('ElementSelectionTooltip', () => {
  const mockTooltipData: TooltipData = {
    reactComponentName: 'TestComponent',
    parentComponentName: 'ParentComponent',
    firstChildComponentName: 'ChildComponent',
    tagName: '<div>',
    parentTag: '<section>',
    firstChildTag: '<span>',
    selector: '#test-id',
    depth: 5,
    childrenCount: 3,
    siblingsCount: 2,
    x: 100,
    y: 200,
  }

  test('should not render when data is null', () => {
    const { container } = render(<ElementSelectionTooltip data={null} />)
    expect(container.firstChild).toBeNull()
  })

  test('should render tooltip with all information when data is provided', () => {
    render(<ElementSelectionTooltip data={mockTooltipData} />)

    // React component section
    expect(screen.getByText('component:')).toBeInTheDocument()
    expect(screen.getByText('TestComponent')).toBeInTheDocument()
    expect(screen.getByText('parent_component:')).toBeInTheDocument()
    expect(screen.getByText('ParentComponent')).toBeInTheDocument()
    expect(screen.getByText('child_component:')).toBeInTheDocument()
    expect(screen.getByText('ChildComponent')).toBeInTheDocument()

    // HTML/CSS section
    expect(screen.getByText('tag:')).toBeInTheDocument()
    expect(screen.getByText('<div>')).toBeInTheDocument()
    expect(screen.getByText('parent_tag:')).toBeInTheDocument()
    expect(screen.getByText('<section>')).toBeInTheDocument()
    expect(screen.getByText('child_tag:')).toBeInTheDocument()
    expect(screen.getByText('<span>')).toBeInTheDocument()
    expect(screen.getByText('selector:')).toBeInTheDocument()
    expect(screen.getByText('#test-id')).toBeInTheDocument()

    // Metrics section
    expect(screen.getByText('max_depth:')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('children:')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('siblings:')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  test('should position tooltip at correct coordinates', () => {
    const { container } = render(<ElementSelectionTooltip data={mockTooltipData} />)
    const tooltip = container.firstChild as HTMLElement

    expect(tooltip.style.left).toBe('100px')
    expect(tooltip.style.top).toBe('200px')
  })

  test('should render without React component section when no components detected', () => {
    const dataWithoutComponents: TooltipData = {
      ...mockTooltipData,
      reactComponentName: null,
      parentComponentName: null,
      firstChildComponentName: null,
    }

    render(<ElementSelectionTooltip data={dataWithoutComponents} />)

    // Should not show component section
    expect(screen.queryByText('component:')).not.toBeInTheDocument()
    expect(screen.queryByText('parent_component:')).not.toBeInTheDocument()
    expect(screen.queryByText('child_component:')).not.toBeInTheDocument()

    // Should still show HTML/CSS section
    expect(screen.getByText('tag:')).toBeInTheDocument()
    expect(screen.getByText('<div>')).toBeInTheDocument()
  })

  test('should show only current component when parent and child are not detected', () => {
    const dataWithOnlyCurrentComponent: TooltipData = {
      ...mockTooltipData,
      reactComponentName: 'CurrentComponent',
      parentComponentName: null,
      firstChildComponentName: null,
    }

    render(<ElementSelectionTooltip data={dataWithOnlyCurrentComponent} />)

    expect(screen.getByText('component:')).toBeInTheDocument()
    expect(screen.getByText('CurrentComponent')).toBeInTheDocument()
    expect(screen.queryByText('parent_component:')).not.toBeInTheDocument()
    expect(screen.queryByText('child_component:')).not.toBeInTheDocument()
  })

  test('should handle MAX_DEPTH_EXCEEDED', () => {
    const dataWithMaxDepth: TooltipData = {
      ...mockTooltipData,
      depth: 'MAX_DEPTH_EXCEEDED',
    }

    render(<ElementSelectionTooltip data={dataWithMaxDepth} />)

    expect(screen.getByText('max_depth:')).toBeInTheDocument()
    expect(screen.getByText('MAX_DEPTH_EXCEEDED')).toBeInTheDocument()
  })

  test('should not show parent_tag when parent is null', () => {
    const dataWithoutParent: TooltipData = {
      ...mockTooltipData,
      parentTag: null,
      parentComponentName: null,
    }

    render(<ElementSelectionTooltip data={dataWithoutParent} />)

    expect(screen.queryByText('parent_tag:')).not.toBeInTheDocument()
    expect(screen.getByText('tag:')).toBeInTheDocument()
  })

  test('should not show child_tag when no children', () => {
    const dataWithoutChildren: TooltipData = {
      ...mockTooltipData,
      firstChildTag: null,
      firstChildComponentName: null,
      childrenCount: 0,
    }

    render(<ElementSelectionTooltip data={dataWithoutChildren} />)

    expect(screen.queryByText('child_tag:')).not.toBeInTheDocument()
    expect(screen.getByText('children:')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('should render dividers between sections', () => {
    const { container } = render(<ElementSelectionTooltip data={mockTooltipData} />)
    const dividers = container.querySelectorAll('[class*="divider"]')

    // Should have 2 dividers (after component section and after HTML/CSS section)
    expect(dividers.length).toBe(2)
  })

  test('should handle zero children and siblings', () => {
    const dataWithNoChildrenOrSiblings: TooltipData = {
      ...mockTooltipData,
      childrenCount: 0,
      siblingsCount: 0,
    }

    render(<ElementSelectionTooltip data={dataWithNoChildrenOrSiblings} />)

    expect(screen.getByText('children:')).toBeInTheDocument()
    expect(screen.getAllByText('0')).toHaveLength(2) // Both children and siblings
  })

  test('should render with class-based selector', () => {
    const dataWithClassSelector: TooltipData = {
      ...mockTooltipData,
      selector: '.my-class.another-class',
    }

    render(<ElementSelectionTooltip data={dataWithClassSelector} />)

    expect(screen.getByText('selector:')).toBeInTheDocument()
    expect(screen.getByText('.my-class.another-class')).toBeInTheDocument()
  })

  test('should render with generated DOM path selector', () => {
    const dataWithPathSelector: TooltipData = {
      ...mockTooltipData,
      selector: 'div > section:nth-of-type(2) > article',
    }

    render(<ElementSelectionTooltip data={dataWithPathSelector} />)

    expect(screen.getByText('selector:')).toBeInTheDocument()
    expect(screen.getByText('div > section:nth-of-type(2) > article')).toBeInTheDocument()
  })
})
