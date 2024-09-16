const DEFAULT_ROOT_ELEMENT = 'root'

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

  const isValidTarget = (target: HTMLElement) => {
    // TODO: is this actually needed? I think we can just check if the target is a child of the root element
    const isChildOfRoot = target !== rootElement && target.closest(`#${DEFAULT_ROOT_ELEMENT}`)

    return (
      !target.classList.contains('ruio-exclude') &&
      isChildOfRoot && // Only apply hover styles to elements inside the root
      target !== rootElement // Exclude the root element itself from hover effects
    )
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
  const restoreOriginalStyles = (target: HTMLElement) => {
    const originalStyle = originalStyles.get(target)

    originalStyle ? target.setAttribute('style', originalStyle) : target.removeAttribute('style')

    if (originalStyle === '') target.style.backgroundColor = ''

    target.classList.remove('ruio-hovered')

    originalStyles.delete(target)
  }

  const applyHoverStyles = (target: HTMLElement, isHovering: boolean) => {
    if (isHovering) {
      if (!originalStyles.has(target)) {
        saveOriginalStyles(target)
      }
      // target.classList.add('ruio-hovered')
      target.style.backgroundColor = 'rgba(153, 181, 214, 0.66)'
    } else {
      restoreOriginalStyles(target)
    }
  }

  const handleHover = (event: MouseEvent) => {
    const target = event.target as HTMLElement

    if (isValidTarget(target)) {
      applyHoverStyles(target, true)
      onHoverOrClick(target)
    }
  }

  const handleMouseOut = (event: MouseEvent) => {
    const target = event.target as HTMLElement

    if (isValidTarget(target) && target.classList.contains('ruio-hovered')) {
      applyHoverStyles(target, false)
    }
  }

  const handleSelect = (event: MouseEvent) => {
    const target = event.target as HTMLElement

    if (isValidTarget(target)) {
      applyHoverStyles(target, false)
      onHoverOrClick(target)
      cleanup()
    }
  }

  document.body.addEventListener('mouseover', handleHover)
  document.body.addEventListener('mouseout', handleMouseOut)
  document.body.addEventListener('click', handleSelect)

  const cleanup = () => {
    document.body.removeEventListener('mouseover', handleHover)
    document.body.removeEventListener('mouseout', handleMouseOut)
    document.body.removeEventListener('click', handleSelect)
  }

  return cleanup
}
