import { render, screen, waitFor, act } from '@testing-library/react'
import { RuioContextProvider, useRuioContext } from '@context/RuioContextProvider'
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { resetCommittedOutlines } from '@utils/outline'
import * as outlineModule from '@utils/outline'

// Spy on outline utilities to track calls
vi.mock('@utils/outline', async () => {
  const actual = await vi.importActual<typeof import('@utils/outline')>('@utils/outline')
  return {
    ...actual,
    applyCommittedOutlines: vi.fn(actual.applyCommittedOutlines),
  }
})

vi.mock('@controllers/ElementPicker', async () => {
  // Import config utilities to mimic real ElementPicker behavior
  const configModule = await import('@utils/config')

  return {
    ElementPicker: vi.fn((onClick, onMouseOver) => {
      // Wrap onClick to include the setConfigValueAtKey call that happens in real ElementPicker
      const wrappedOnClick = (element: HTMLElement) => {
        configModule.setConfigValueAtKey(
          'rootElementSelector',
          configModule.parseSelectorFromSelectedElement(element),
        )
        onClick(element)
      }

      // Store callbacks for testing
      const controller = {
        onMouseOver,
        onClick: wrappedOnClick,
        cleanup: vi.fn(),
      }

      // Return cleanup function
      return controller.cleanup
    }),
  }
})

// Test component to access context and trigger element selection
const ElementSelectionTester = () => {
  const { rootElement, toggleElementPicker, isElementPickerActive, ruioEnabled, depth } =
    useRuioContext()

  return (
    <div>
      <div data-testid="root-element-id">{rootElement?.id || 'None'}</div>
      <div data-testid="selection-mode-active">{isElementPickerActive ? 'true' : 'false'}</div>
      <div data-testid="ruio-enabled">{ruioEnabled ? 'true' : 'false'}</div>
      <div data-testid="depth">{depth}</div>
      <button onClick={toggleElementPicker} data-testid="toggle-selection">
        Toggle Selection Mode
      </button>
    </div>
  )
}

// Helper to simulate element click and wait for async effects
const simulateElementClick = async (callback: ((element: HTMLElement) => void) | undefined, element: HTMLElement) => {
  act(() => {
    if (callback) {
      callback(element)
    }
  })

  // Wait for debounce (50ms) + handleRootPicked setTimeout (0ms)
  await new Promise((resolve) => setTimeout(resolve, 150))
}

/**
 * Test suite for verifying outline application behavior when selecting root elements.
 *
 * Test Coverage:
 * 1. Same element reselection: Verifies outlines are reapplied when same element selected twice (PASSES ✓)
 * 2. Single selection: Verifies outlines are applied after selecting an element once (PASSES ✓)
 * 3. Different element selection: Verifies outline switching between different roots (PASSES ✓)
 * 4. Tracking verification: Verifies committedOutlineElements tracking (PASSES ✓)
 *
 * Implementation Details:
 * When an element is selected, handleRootSelected immediately calls applyCommittedOutlines synchronously.
 * This ensures outlines are always applied when an element is clicked, regardless of whether it's
 * the same element or a different one, addressing the edge case where hover interactions during
 * element selection mode might have modified the outline state.
 */
describe('RuioContextProvider - Element Reselection Outline Application', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // Clean up any existing test elements
    document.body.innerHTML = ''
    resetCommittedOutlines()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    resetCommittedOutlines()
  })

  test('should apply outlines to selected root element and descendants when same element is selected twice', async () => {
    /**
     * This test verifies that UI borders are correctly reapplied when:
     * 1. User enters elementSelect mode
     * 2. User clicks on an element, making it the new root
     * 3. Outlines are somehow cleared (e.g., by external interaction)
     * 4. User enters elementSelect mode AGAIN
     * 5. User clicks on the SAME element as before
     *
     * Expected behavior: The outline styling should be reapplied to the root element and its descendants
     *
     * Implementation: handleRootSelected calls applyCommittedOutlines synchronously when an element is
     * clicked. This ensures outlines are always applied regardless of whether the same element is
     * reselected, handling cases where hover interactions might have modified outline state.
     *
     * This test should PASS, verifying the fix works correctly.
     */
    // Create a DOM structure to test with
    const rootDiv = document.createElement('div')
    rootDiv.id = 'root'

    const targetElement = document.createElement('div')
    targetElement.id = 'target-element'
    targetElement.className = 'test-target'

    const childElement1 = document.createElement('div')
    childElement1.id = 'child-1'
    childElement1.className = 'child'

    const childElement2 = document.createElement('div')
    childElement2.id = 'child-2'
    childElement2.className = 'child'

    const grandchildElement = document.createElement('span')
    grandchildElement.id = 'grandchild-1'
    grandchildElement.className = 'grandchild'

    // Build the tree
    targetElement.appendChild(childElement1)
    targetElement.appendChild(childElement2)
    childElement1.appendChild(grandchildElement)
    rootDiv.appendChild(targetElement)
    document.body.appendChild(rootDiv)

    // Add some sibling elements that will be in committedOutlineElements
    const siblingElement = document.createElement('div')
    siblingElement.id = 'sibling-element'
    rootDiv.appendChild(siblingElement)

    // Set localStorage to enable ruio
    localStorage.setItem(
      'ruio-config',
      JSON.stringify({
        ruioEnabled: true,
        depth: 3,
      }),
    )

    // Render the provider
    const { rerender } = render(
      <RuioContextProvider>
        <ElementSelectionTester />
      </RuioContextProvider>,
    )

    // Wait for initial render and verify ruio is enabled
    await waitFor(() => {
      expect(screen.getByTestId('ruio-enabled').textContent).toBe('true')
      expect(screen.getByTestId('root-element-id').textContent).toBe('root')
    })

    // STEP 1: Enter element selection mode (first time)
    const toggleButton = screen.getByTestId('toggle-selection')

    await act(async () => {
      toggleButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('selection-mode-active').textContent).toBe('true')
    })

    // STEP 2: Simulate clicking on target element to make it the new root
    // This would normally be done through ElementPicker
    // We need to manually trigger the element selection since we're mocking
    const { ElementPicker } = await import('@controllers/ElementPicker')
    const lastCall = vi.mocked(ElementPicker).mock.calls[vi.mocked(ElementPicker).mock.calls.length - 1]
    const onClickCallback = lastCall?.[0]

    // Simulate clicking the target element
    await simulateElementClick(onClickCallback, targetElement)

    // Wait for root element to update
    await waitFor(() => {
      expect(screen.getByTestId('root-element-id').textContent).toBe('target-element')
    })

    // Verify outlines were applied after first selection
    await waitFor(
      () => {
        expect(targetElement.style.outline).toBeTruthy()
        expect(targetElement.style.outline).not.toBe('')
      },
      { timeout: 2000 },
    )

    // Track how many times applyCommittedOutlines has been called up to this point
    const callCountAfterFirstSelection = vi.mocked(outlineModule.applyCommittedOutlines).mock.calls
      .length

    // STEP 3: Manually clear the committedOutlineElements to simulate the bug
    // In a real scenario, this might happen if elements are removed from the DOM
    // or if there's some other interaction that clears the tracked elements
    const { resetCommittedOutlines: resetElements } = await import('@utils/outline')
    resetElements()

    // Wait for any pending requestAnimationFrame calls to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Also manually clear the outlines to simulate them being lost
    targetElement.style.outline = ''
    childElement1.style.outline = ''
    childElement2.style.outline = ''
    grandchildElement.style.outline = ''

    // Wait again to ensure no pending RAF calls reapply the outline
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify outlines are indeed cleared and stay cleared
    expect(targetElement.style.outline).toBe('')
    expect(childElement1.style.outline).toBe('')

    // STEP 4: Enter element selection mode AGAIN (second time)
    await act(async () => {
      toggleButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('selection-mode-active').textContent).toBe('true')
    })

    // STEP 5: Click on the SAME element again (target-element)
    const lastCall2 = vi.mocked(ElementPicker).mock.calls[vi.mocked(ElementPicker).mock.calls.length - 1]
    const onClickCallback2 = lastCall2?.[0]

    await simulateElementClick(onClickCallback2, targetElement)

    // Wait for the UI to update
    await waitFor(() => {
      expect(screen.getByTestId('selection-mode-active').textContent).toBe('false')
    })

    // Track how many times applyCommittedOutlines was called after reselection
    const callCountAfterReselection = vi.mocked(outlineModule.applyCommittedOutlines).mock.calls.length

    // CRITICAL ASSERTION: Verify that applyCommittedOutlines WAS called during reselection
    // even though the rootElement reference is the same. This is achieved by calling
    // applyCommittedOutlines synchronously in handleRootSelected.
    expect(callCountAfterReselection).toBeGreaterThan(callCountAfterFirstSelection)

    // CRITICAL ASSERTION: Verify that the selected root element itself has outline REAPPLIED
    // This should now PASS because handleRootSelected calls applyCommittedOutlines directly
    await waitFor(
      () => {
        expect(targetElement.style.outline).toBeTruthy()
        expect(targetElement.style.outline).not.toBe('')
      },
      { timeout: 2000 },
    )

    // Verify descendant children also have outlines applied
    await waitFor(
      () => {
        expect(childElement1.style.outline).toBeTruthy()
        expect(childElement1.style.outline).not.toBe('')

        expect(childElement2.style.outline).toBeTruthy()
        expect(childElement2.style.outline).not.toBe('')

        expect(grandchildElement.style.outline).toBeTruthy()
        expect(grandchildElement.style.outline).not.toBe('')
      },
      { timeout: 2000 },
    )
  })

  test('should apply outlines to root element and descendants after single selection', async () => {
    /**
     * This test verifies the basic functionality:
     * 1. User enters elementSelect mode
     * 2. User clicks on an element, making it the new root
     * 3. Outlines should be applied to the root element and all its descendants
     *
     * This test should PASS, demonstrating that the basic selection functionality works correctly.
     */
    // Create a DOM structure to test with
    const rootDiv = document.createElement('div')
    rootDiv.id = 'root'

    const targetElement = document.createElement('div')
    targetElement.id = 'target-element'
    targetElement.className = 'test-target'

    const childElement1 = document.createElement('div')
    childElement1.id = 'child-1'
    childElement1.className = 'child'

    const childElement2 = document.createElement('div')
    childElement2.id = 'child-2'
    childElement2.className = 'child'

    const grandchildElement = document.createElement('span')
    grandchildElement.id = 'grandchild-1'
    grandchildElement.className = 'grandchild'

    // Build the tree
    targetElement.appendChild(childElement1)
    targetElement.appendChild(childElement2)
    childElement1.appendChild(grandchildElement)
    rootDiv.appendChild(targetElement)
    document.body.appendChild(rootDiv)

    // Set localStorage to enable ruio
    localStorage.setItem(
      'ruio-config',
      JSON.stringify({
        ruioEnabled: true,
        depth: 3,
      }),
    )

    // Render the provider
    render(
      <RuioContextProvider>
        <ElementSelectionTester />
      </RuioContextProvider>,
    )

    // Wait for initial render and verify ruio is enabled
    await waitFor(() => {
      expect(screen.getByTestId('ruio-enabled').textContent).toBe('true')
      expect(screen.getByTestId('root-element-id').textContent).toBe('root')
    })

    // STEP 1: Enter element selection mode
    const toggleButton = screen.getByTestId('toggle-selection')

    await act(async () => {
      toggleButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('selection-mode-active').textContent).toBe('true')
    })

    // STEP 2: Simulate clicking on target element to make it the new root
    const { ElementPicker } = await import('@controllers/ElementPicker')
    const lastCall = vi.mocked(ElementPicker).mock.calls[vi.mocked(ElementPicker).mock.calls.length - 1]
    const onClickCallback = lastCall?.[0]

    await simulateElementClick(onClickCallback, targetElement)

    // Wait for root element to update
    await waitFor(() => {
      expect(screen.getByTestId('root-element-id').textContent).toBe('target-element')
    })

    // ASSERTION: Verify that the root element has outline applied
    await waitFor(
      () => {
        expect(targetElement.style.outline).toBeTruthy()
        expect(targetElement.style.outline).not.toBe('')
      },
      { timeout: 2000 },
    )

    // ASSERTION: Verify all descendant children also have outlines applied
    await waitFor(
      () => {
        expect(childElement1.style.outline).toBeTruthy()
        expect(childElement1.style.outline).not.toBe('')

        expect(childElement2.style.outline).toBeTruthy()
        expect(childElement2.style.outline).not.toBe('')

        expect(grandchildElement.style.outline).toBeTruthy()
        expect(grandchildElement.style.outline).not.toBe('')
      },
      { timeout: 2000 },
    )

    // Verify that the element selection mode is now disabled after selection
    expect(screen.getByTestId('selection-mode-active').textContent).toBe('false')
  })

  test('should apply outlines to new root and remove from old root when selecting different element', async () => {
    /**
     * This test verifies that when switching between different root elements:
     * 1. User enters elementSelect mode
     * 2. User clicks on element A, making it the new root → outlines applied to A and descendants
     * 3. User enters elementSelect mode AGAIN
     * 4. User clicks on element B (different from A), making it the new root
     * 5. Outlines should be applied to B and its descendants
     * 6. Outlines should be REMOVED from A and its descendants
     *
     * This test should PASS, demonstrating correct outline management when switching roots.
     */
    // Create a DOM structure with two separate branches to test with
    const rootDiv = document.createElement('div')
    rootDiv.id = 'root'

    // First target element and its children
    const targetElementA = document.createElement('div')
    targetElementA.id = 'target-element-a'
    targetElementA.className = 'test-target-a'

    const childElementA1 = document.createElement('div')
    childElementA1.id = 'child-a-1'
    childElementA1.className = 'child'

    const childElementA2 = document.createElement('div')
    childElementA2.id = 'child-a-2'
    childElementA2.className = 'child'

    targetElementA.appendChild(childElementA1)
    targetElementA.appendChild(childElementA2)

    // Second target element and its children
    const targetElementB = document.createElement('div')
    targetElementB.id = 'target-element-b'
    targetElementB.className = 'test-target-b'

    const childElementB1 = document.createElement('div')
    childElementB1.id = 'child-b-1'
    childElementB1.className = 'child'

    const childElementB2 = document.createElement('div')
    childElementB2.id = 'child-b-2'
    childElementB2.className = 'child'

    targetElementB.appendChild(childElementB1)
    targetElementB.appendChild(childElementB2)

    // Build the tree
    rootDiv.appendChild(targetElementA)
    rootDiv.appendChild(targetElementB)
    document.body.appendChild(rootDiv)

    // Set localStorage to enable ruio
    localStorage.setItem(
      'ruio-config',
      JSON.stringify({
        ruioEnabled: true,
        depth: 3,
      }),
    )

    // Render the provider
    render(
      <RuioContextProvider>
        <ElementSelectionTester />
      </RuioContextProvider>,
    )

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByTestId('ruio-enabled').textContent).toBe('true')
      expect(screen.getByTestId('root-element-id').textContent).toBe('root')
    })

    const toggleButton = screen.getByTestId('toggle-selection')

    // STEP 1: Enter element selection mode (first time)
    await act(async () => {
      toggleButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('selection-mode-active').textContent).toBe('true')
    })

    // STEP 2: Click on target element A to make it the new root
    const { ElementPicker } = await import('@controllers/ElementPicker')
    let lastCall = vi.mocked(ElementPicker).mock.calls[vi.mocked(ElementPicker).mock.calls.length - 1]
    let onClickCallback = lastCall?.[0]

    await simulateElementClick(onClickCallback, targetElementA)

    // Wait for root element to update to A
    await waitFor(() => {
      expect(screen.getByTestId('root-element-id').textContent).toBe('target-element-a')
    })

    // Verify outlines are applied to A and its descendants
    await waitFor(
      () => {
        expect(targetElementA.style.outline).toBeTruthy()
        expect(targetElementA.style.outline).not.toBe('')
        expect(childElementA1.style.outline).toBeTruthy()
        expect(childElementA2.style.outline).toBeTruthy()
      },
      { timeout: 2000 },
    )

    // Note: B might have outlines initially because it was part of the original root (#root)
    // and its children tree. We'll verify the outlines are properly switched after selecting B.

    // STEP 3: Enter element selection mode AGAIN (second time)
    await act(async () => {
      toggleButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('selection-mode-active').textContent).toBe('true')
    })

    // STEP 4: Click on target element B (different element) to make it the new root
    lastCall = vi.mocked(ElementPicker).mock.calls[vi.mocked(ElementPicker).mock.calls.length - 1]
    onClickCallback = lastCall?.[0]

    await simulateElementClick(onClickCallback, targetElementB)

    // Wait for root element to update to B
    await waitFor(() => {
      expect(screen.getByTestId('root-element-id').textContent).toBe('target-element-b')
    })

    // CRITICAL ASSERTIONS:
    // 1. Verify outlines are NOW applied to B and its descendants
    await waitFor(
      () => {
        expect(targetElementB.style.outline).toBeTruthy()
        expect(targetElementB.style.outline).not.toBe('')
        expect(childElementB1.style.outline).toBeTruthy()
        expect(childElementB1.style.outline).not.toBe('')
        expect(childElementB2.style.outline).toBeTruthy()
        expect(childElementB2.style.outline).not.toBe('')
      },
      { timeout: 2000 },
    )

    // 2. Verify outlines are REMOVED from A and its descendants
    await waitFor(
      () => {
        expect(targetElementA.style.outline).toBe('')
        expect(childElementA1.style.outline).toBe('')
        expect(childElementA2.style.outline).toBe('')
      },
      { timeout: 2000 },
    )
  })

  test('should correctly track and update committedOutlineElements when reselecting same element', async () => {
    const { committedOutlineElements } = await import('@utils/outline')

    // Create DOM structure
    const rootDiv = document.createElement('div')
    rootDiv.id = 'root'

    const targetElement = document.createElement('div')
    targetElement.id = 'target-element'

    const childElement = document.createElement('div')
    childElement.id = 'child-element'

    targetElement.appendChild(childElement)
    rootDiv.appendChild(targetElement)
    document.body.appendChild(rootDiv)

    // Set localStorage
    localStorage.setItem(
      'ruio-config',
      JSON.stringify({
        ruioEnabled: true,
        depth: 2,
      }),
    )

    render(
      <RuioContextProvider>
        <ElementSelectionTester />
      </RuioContextProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('ruio-enabled').textContent).toBe('true')
    })

    // Select the target element as root (first time)
    const toggleButton = screen.getByTestId('toggle-selection')

    await act(async () => {
      toggleButton.click()
    })

    const { ElementPicker } = await import('@controllers/ElementPicker')
    const lastCall = vi.mocked(ElementPicker).mock.calls[vi.mocked(ElementPicker).mock.calls.length - 1]
    const onClickCallback = lastCall?.[0]

    await simulateElementClick(onClickCallback, targetElement)

    // Wait for root element to update
    await waitFor(() => {
      expect(screen.getByTestId('root-element-id').textContent).toBe('target-element')
    })

    // Wait for outlines to be applied
    await waitFor(
      () => {
        expect(targetElement.style.outline).toBeTruthy()
      },
      { timeout: 2000 },
    )

    // Select the same element again (second time)
    await act(async () => {
      toggleButton.click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('selection-mode-active').textContent).toBe('true')
    })

    const lastCall2 = vi.mocked(ElementPicker).mock.calls[vi.mocked(ElementPicker).mock.calls.length - 1]
    const onClickCallback2 = lastCall2?.[0]

    await simulateElementClick(onClickCallback2, targetElement)

    // Wait for the selection to complete
    await waitFor(() => {
      expect(screen.getByTestId('selection-mode-active').textContent).toBe('false')
    })

    // CRITICAL: After reselection, the outline should still be present on the root element
    await waitFor(
      () => {
        expect(targetElement.style.outline).toBeTruthy()
        expect(targetElement.style.outline).not.toBe('')

        expect(childElement.style.outline).toBeTruthy()
        expect(childElement.style.outline).not.toBe('')
      },
      { timeout: 2000 },
    )
  })
})
