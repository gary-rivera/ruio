import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RuioContextProvider } from '@root/context/RuioContextProvider'
import { ElementPreviewTooltip } from '@components/tooltip/ElementPreviewTooltip'
import React from 'react'

/**
 * Integration tests for element selection tooltip
 * Tests the interaction between hovering over elements and tooltip rendering
 */
describe('Element Selection Tooltip Integration', () => {
  let rootElement: HTMLElement
  let container: HTMLElement

  beforeEach(() => {
    // Create a root element for the app
    rootElement = document.createElement('div')
    rootElement.id = 'root'
    document.body.appendChild(rootElement)

    // Create container for tests
    container = document.createElement('div')
    container.id = 'test-container'
    rootElement.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(rootElement)
  })

  const TestApp = ({ children }: { children: React.ReactNode }) => {
    return <RuioContextProvider>{children}</RuioContextProvider>
  }

  test('should calculate correct metrics for simple element', async () => {
    const parent = document.createElement('section')
    parent.id = 'parent-section'
    const element = document.createElement('div')
    element.className = 'test-element'
    const child1 = document.createElement('span')
    const child2 = document.createElement('span')

    parent.appendChild(element)
    element.appendChild(child1)
    element.appendChild(child2)
    container.appendChild(parent)

    const { getElementInfo } = await import('@utils/elementInfo')
    const info = getElementInfo(element)

    expect(info.tagName).toBe('<div>')
    expect(info.parentTag).toBe('<section>')
    expect(info.firstChildTag).toBe('<span>')
    expect(info.selector).toBe('.test-element')
    expect(info.childrenCount).toBe(2)
    expect(info.siblingsCount).toBe(0)
    expect(info.depth).toBeGreaterThanOrEqual(1)
  })

  test('should calculate correct metrics for nested structure', async () => {
    // Create: parent > element > child > grandchild
    const parent = document.createElement('article')
    const element = document.createElement('div')
    element.id = 'target'
    const child = document.createElement('section')
    const grandchild = document.createElement('p')

    parent.appendChild(element)
    element.appendChild(child)
    child.appendChild(grandchild)
    container.appendChild(parent)

    const { getElementInfo } = await import('@utils/elementInfo')
    const info = getElementInfo(element)

    expect(info.tagName).toBe('<div>')
    expect(info.parentTag).toBe('<article>')
    expect(info.firstChildTag).toBe('<section>')
    expect(info.selector).toBe('#target')
    expect(info.childrenCount).toBe(1)
    expect(info.depth).toBe(2) // child -> grandchild
  })

  test('should handle element with siblings correctly', async () => {
    const parent = document.createElement('div')
    const sibling1 = document.createElement('div')
    const element = document.createElement('div')
    element.className = 'middle'
    const sibling2 = document.createElement('div')

    parent.appendChild(sibling1)
    parent.appendChild(element)
    parent.appendChild(sibling2)
    container.appendChild(parent)

    const { getElementInfo } = await import('@utils/elementInfo')
    const info = getElementInfo(element)

    expect(info.siblingsCount).toBe(2)
  })

  test('should calculate depth correctly for complex tree', async () => {
    // Create a tree with varying depths
    const root = document.createElement('div')
    const branch1 = document.createElement('div')
    const branch2 = document.createElement('div')
    const leaf1 = document.createElement('span')
    const leaf2 = document.createElement('span')
    const deepLeaf = document.createElement('p')

    root.appendChild(branch1)
    root.appendChild(branch2)
    branch1.appendChild(leaf1)
    branch2.appendChild(leaf2)
    leaf2.appendChild(deepLeaf)
    container.appendChild(root)

    const { getElementInfo } = await import('@utils/elementInfo')
    const info = getElementInfo(root)

    // Max depth is root -> branch2 -> leaf2 -> deepLeaf = 3
    expect(info.depth).toBe(3)
  })

  test('should ignore script tags in depth calculation', async () => {
    const root = document.createElement('div')
    const child = document.createElement('div')
    const script = document.createElement('script')
    const scriptChild = document.createElement('div')

    root.appendChild(child)
    root.appendChild(script)
    script.appendChild(scriptChild)
    container.appendChild(root)

    const { getElementInfo } = await import('@utils/elementInfo')
    const info = getElementInfo(root)

    // Should only count the regular child, not script or its children
    expect(info.depth).toBe(1)
    expect(info.childrenCount).toBe(2) // Includes script in children count
  })

  test('should handle element with no parent', async () => {
    const orphan = document.createElement('div')

    const { getElementInfo } = await import('@utils/elementInfo')
    const info = getElementInfo(orphan)

    expect(info.parentTag).toBeNull()
    expect(info.siblingsCount).toBe(0)
  })

  test('should handle element with no children', async () => {
    const leaf = document.createElement('div')
    container.appendChild(leaf)

    const { getElementInfo } = await import('@utils/elementInfo')
    const info = getElementInfo(leaf)

    expect(info.firstChildTag).toBeNull()
    expect(info.childrenCount).toBe(0)
    expect(info.depth).toBe(0)
  })

  test('should use ID selector over class selector', async () => {
    const element = document.createElement('div')
    element.id = 'unique-id'
    element.className = 'some-class'
    container.appendChild(element)

    const { getElementInfo } = await import('@utils/elementInfo')
    const info = getElementInfo(element)

    expect(info.selector).toBe('#unique-id')
  })

  test('should use class selector when no ID', async () => {
    const element = document.createElement('div')
    element.className = 'class-one class-two'
    container.appendChild(element)

    const { getElementInfo } = await import('@utils/elementInfo')
    const info = getElementInfo(element)

    expect(info.selector).toBe('.class-one.class-two')
  })

  test('should generate DOM path selector when no ID or classes', async () => {
    const parent = document.createElement('section')
    const element = document.createElement('div')
    parent.appendChild(element)
    container.appendChild(parent)

    const { getElementInfo } = await import('@utils/elementInfo')
    const info = getElementInfo(element)

    // Should generate path-based selector
    expect(info.selector).toContain('div')
    expect(info.selector).not.toBe('.') // No class
    expect(info.selector).not.toBe('#') // No ID
  })

  test('should extract React component name from fiber', async () => {
    const element = document.createElement('div')

    // Mock React Fiber
    ;(element as any).__reactFiber$test = {
      type: function TestComponent() {},
    }

    container.appendChild(element)

    const { getElementInfo } = await import('@utils/elementInfo')
    const info = getElementInfo(element)

    expect(info.reactComponentName).toBe('TestComponent')
  })


  test('should handle very deep tree with MAX_DEPTH_EXCEEDED', async () => {
    const root = document.createElement('div')
    let current = root

    // Create tree deeper than 100 levels
    for (let i = 0; i < 105; i++) {
      const child = document.createElement('div')
      current.appendChild(child)
      current = child
    }

    container.appendChild(root)

    const { getElementInfo } = await import('@utils/elementInfo')
    const info = getElementInfo(root)

    expect(info.depth).toBe('MAX_DEPTH_EXCEEDED')
  })

  test('should accurately count children excluding text nodes', async () => {
    const parent = document.createElement('div')

    // Add mix of element and text nodes
    parent.appendChild(document.createTextNode('text'))
    parent.appendChild(document.createElement('div'))
    parent.appendChild(document.createTextNode('more text'))
    parent.appendChild(document.createElement('span'))
    parent.appendChild(document.createTextNode('even more'))

    container.appendChild(parent)

    const { getElementInfo } = await import('@utils/elementInfo')
    const info = getElementInfo(parent)

    expect(info.childrenCount).toBe(2) // Only div and span
  })

  test('should calculate metrics consistently across multiple calls', async () => {
    const element = document.createElement('div')
    element.id = 'consistent'
    const child = document.createElement('span')
    element.appendChild(child)
    container.appendChild(element)

    const { getElementInfo } = await import('@utils/elementInfo')

    const info1 = getElementInfo(element)
    const info2 = getElementInfo(element)
    const info3 = getElementInfo(element)

    // All calls should return identical results
    expect(info1).toEqual(info2)
    expect(info2).toEqual(info3)
  })
})
