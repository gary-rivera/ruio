const DEFAULT_ROOT_ELEMENT = 'root' // !important: adjust this to match the root element id in your project

/**
 * Attaches hover and click listeners to elements under the specified root element.
 * When an element is hovered or clicked, the provided callback function is executed.
 *
 * @param {function(HTMLElement): void} onHoverOrClick - The callback function to be invoked when an element is hovered or clicked.
 * @returns {function(): void} - A cleanup function that removes all attached event listeners.
 */
export const ElementInteractionController = (onHoverOrClick: (element: HTMLElement) => void) => {
  const rootElement = document.querySelector(`#${DEFAULT_ROOT_ELEMENT}`) as HTMLElement

  if (!rootElement) {
    console.error(
      "[ruio][ElementInteractionController] Root element not found. Make sure your project's root element matches the DEFAULT_ROOT_ELEMENT: ",
      DEFAULT_ROOT_ELEMENT,
    )
    return
  }

  /**
   * Determines if the target element is valid for hover or click interaction.
   *
   * @param {HTMLElement} target - The DOM element being interacted with.
   * @returns {boolean} - Returns true if the target is valid, false otherwise.
   */
  const isValidTarget = (target: HTMLElement) => {
    return (
      !target.classList.contains('ruio-exclude') &&
      target.closest(`#${DEFAULT_ROOT_ELEMENT}`) &&
      target !== rootElement
    )
  }

  /**
   * Applies or removes hover styles on the target element.
   *
   * @param {HTMLElement} target - The element to apply hover styles to.
   * @param {boolean} isHovering - Whether the hover styles should be applied or removed.
   */
  const applyHoverStyles = (target: HTMLElement, isHovering: boolean) => {
    target.style.outline = isHovering ? '2px dashed blue' : ''
    target.style.backgroundColor = isHovering ? 'rgba(0, 0, 255, 0.1)' : ''
  }

  /**
   * Handles the mouseover event and applies hover styles if the target is valid.
   *
   * @param {MouseEvent} event - The mouse event triggered by hovering.
   */
  const handleHover = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (isValidTarget(target)) {
      applyHoverStyles(target, true)
      onHoverOrClick(target)
    }
  }

  /**
   * Handles the mouseout event and removes hover styles if the target is valid.
   *
   * @param {MouseEvent} event - The mouse event triggered when the mouse leaves the element.
   */
  const handleMouseOut = (event: MouseEvent) => {
    const target = event.target as HTMLElement

    if (isValidTarget(target)) {
      applyHoverStyles(target, false)
    }
  }

  /**
   * Handles the click event, removes hover styles, and invokes the callback for the selected element.
   *
   * @param {MouseEvent} event - The mouse event triggered by clicking an element.
   */
  const handleSelect = (event: MouseEvent) => {
    const target = event.target as HTMLElement

    if (isValidTarget(target)) {
      applyHoverStyles(target, false)
      onHoverOrClick(target)
      cleanup()
    }
  }

  // Attach event listeners
  document.body.addEventListener('mouseover', handleHover)
  document.body.addEventListener('mouseout', handleMouseOut)
  document.body.addEventListener('click', handleSelect)

  /**
   * Callback fn to clean up event listeners added to the document body once root element is selected.
   */
  const cleanup = () => {
    document.body.removeEventListener('mouseover', handleHover)
    document.body.removeEventListener('mouseout', handleMouseOut)
    document.body.removeEventListener('click', handleSelect)
  }

  return cleanup
}
