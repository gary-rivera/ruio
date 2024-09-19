const DEFAULT_ROOT_ELEMENT = 'root'

/**
 * Attaches hover and click listeners to elements under the specified root element.
 * When an element is hovered or clicked, the provided callback function is executed.
 *
 * @param {function(HTMLElement): void} onHover - The callback function to be invoked when an element is hovered. Adds styling and applys borders
 * @param {function(HTMLElement): void} onClick - The callback function to be invoked when an element is clicked. Removes styling and borders, cleans up event listeners, and toggles ruioEnabled state to off
 * @returns {function(): void} - A cleanup function that removes all attached event listeners.
 */
export const ElementInteractionController = (
  onHover: (element: HTMLElement) => void,
  onClick: (element: HTMLElement) => void,
) => {
  const rootElement = document.querySelector(`#${DEFAULT_ROOT_ELEMENT}`) as HTMLElement

  if (!rootElement) {
    console.error(
      "[ruio][ElementInteractionController] Root element not found. Make sure your project's root element matches the DEFAULT_ROOT_ELEMENT: ",
      DEFAULT_ROOT_ELEMENT,
    )
    return
  }

  const isValidTarget = (target: HTMLElement) => {
    const isChildOfRoot = target !== rootElement && target.closest(`#${DEFAULT_ROOT_ELEMENT}`)
    return !target.classList.contains('ruio-exclude') && isChildOfRoot && target !== rootElement
    // const isChildOfRoot = target !== rootElement && target.closest(`#${DEFAULT_ROOT_ELEMENT}`)
    // return !target.classList.contains('ruio-exclude') && isChildOfRoot && target !== rootElement
  }

  const originalStyles = new Map<HTMLElement, string>()

  /**
   * Saves the element's current inline styles before applying new hover styles.
   *
   * @param {HTMLElement} target - The element to apply hover styles to.
   */
  const saveOriginalStyles = (target: HTMLElement) => {
    if (!target.classList.contains('ruio-hovered')) {
      originalStyles.set(target, target.getAttribute('style') || '')
      target.classList.add('ruio-hovered')
    }
  }

  /**
   * Restores the original inline styles to the element.
   *
   * @param {HTMLElement} target - The element whose styles should be restored.
   */

  // TODO: we need to ensure the ElemntInteractionController is updated to handle this case
  // requires being more restrictive in the hover and click event listeners, namely our logic behind storing element styles in the originalStyles map section
  const restoreOriginalStyles = (target: HTMLElement) => {
    const originalStyle = originalStyles.get(target)

    originalStyle ? target.setAttribute('style', originalStyle) : target.removeAttribute('style')
    if (originalStyle === '') target.style.backgroundColor = ''

    target.classList.remove('ruio-hovered')
    originalStyles.delete(target)
  }

  const applyHoverStyles = (target: HTMLElement) => {
    if (!originalStyles.has(target)) {
      saveOriginalStyles(target)
    }
    target.style.backgroundColor = 'rgba(153, 181, 214, 0.66)'
  }

  const removeHoverStyles = (target: HTMLElement) => {
    restoreOriginalStyles(target)
  }

  const handleHover = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (isValidTarget(target)) {
      applyHoverStyles(target)
      onHover(target)
    }
  }

  const handleMouseOut = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (isValidTarget(target) && target.classList.contains('ruio-hovered')) {
      removeHoverStyles(target)
    }
  }

  const handleClick = (event: MouseEvent) => {
    event.preventDefault()

    const target = event.target as HTMLElement
    if (isValidTarget(target)) {
      removeHoverStyles(target)
      onClick(target)
      cleanup()
    }
  }

  document.body.addEventListener('mouseover', handleHover)
  document.body.addEventListener('mouseout', handleMouseOut)
  document.body.addEventListener('click', handleClick)

  const cleanup = () => {
    document.body.removeEventListener('mouseover', handleHover)
    document.body.removeEventListener('mouseout', handleMouseOut)
    document.body.removeEventListener('click', handleClick)
  }

  return cleanup
}
