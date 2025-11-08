import { setConfigValueAtKey, parseSelectorFromSelectedElement } from '@utils/config'

const DEFAULT_ROOT_ELEMENT = 'root'

/**
 * Attaches hover and click listeners to elements under the specified root element.
 * When an element is hovered or clicked, the provided callback function is executed.
 *
 * @param {function(HTMLElement, number, number): void} onHover - The callback function to be invoked when an element is hovered. Adds styling and applys borders. Receives element and mouse coordinates.
 * @param {function(HTMLElement): void} onClick - The callback function to be invoked when an element is clicked. Removes styling and borders, cleans up event listeners, and toggles ruioEnabled state to off
 * @param {function(): void} onMouseOut - Optional callback invoked when mouse leaves an element
 * @returns {function(): void} - A cleanup function that removes all attached event listeners.
 */
export const ElementInteractionController = (
  onHover: (element: HTMLElement, x: number, y: number) => void,
  onClick: (element: HTMLElement) => void,
  onMouseOut?: () => void,
) => {
  const rootElement = document.querySelector(`#${DEFAULT_ROOT_ELEMENT}`) as HTMLElement
  if (!rootElement) {
    console.error(
      "[ruio][ElementInteractionController] Root element not found. Make sure your project's root element matches the DEFAULT_ROOT_ELEMENT: ",
      DEFAULT_ROOT_ELEMENT,
    )
    // Return a no-op cleanup function to prevent undefined errors
    return () => {}
  }

  /**
   * Checks if an element takes up the entire viewport (or nearly all of it).
   * Elements that fill the viewport are typically not useful to inspect.
   *
   * @param {HTMLElement} element - The element to check.
   * @returns {boolean} - True if the element fills 95% or more of the viewport.
   */
  const isFullViewport = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect()
    const viewportThreshold = 0.95

    return (
      rect.width >= window.innerWidth * viewportThreshold &&
      rect.height >= window.innerHeight * viewportThreshold
    )
  }

  const isValidTarget = (target: HTMLElement) => {
    const targetIsDescendantOfRoot = target.closest(`#${DEFAULT_ROOT_ELEMENT}`)
    const targetIsDescendantOfRuio = target.closest('[id^="ruio-exclude"]')
    const targetFillsViewport = isFullViewport(target)

    return targetIsDescendantOfRoot && !targetIsDescendantOfRuio && !targetFillsViewport
  }

  const originalStyles = new Map<HTMLElement, Map<string, string>>()

  /**
   * Parses inline style string into a Map of property-value pairs.
   *
   * @param {string} styleString - The inline style string to parse.
   * @returns {Map<string, string>} - Map of CSS property to value.
   */
  const parseStyleString = (styleString: string): Map<string, string> => {
    const styleMap = new Map<string, string>()
    if (!styleString) return styleMap

    const declarations = styleString.split(';').filter(Boolean)
    declarations.forEach((declaration) => {
      const colonIndex = declaration.indexOf(':')
      if (colonIndex > 0) {
        const property = declaration.slice(0, colonIndex).trim()
        const value = declaration.slice(colonIndex + 1).trim()
        if (property && value) {
          styleMap.set(property, value)
        }
      }
    })

    return styleMap
  }

  /**
   * Saves the element's current inline styles before applying new hover styles.
   * Stores styles as a Map for efficient property-level operations.
   *
   * @param {HTMLElement} target - The element to apply hover styles to.
   */
  const saveOriginalStyles = (target: HTMLElement) => {
    if (!target.classList.contains('ruio-hovered')) {
      const styleString = target.getAttribute('style') || ''
      const styleMap = parseStyleString(styleString)
      originalStyles.set(target, styleMap)
      target.classList.add('ruio-hovered')
    }
  }

  /**
   * Converts a Map of style properties to an inline style string.
   *
   * @param {Map<string, string>} styleMap - Map of CSS property to value.
   * @returns {string} - Inline style string.
   */
  const styleMapToString = (styleMap: Map<string, string>): string => {
    const styles: string[] = []
    styleMap.forEach((value, property) => {
      styles.push(`${property}: ${value}`)
    })
    return styles.join('; ')
  }

  /**
   * Restores the original inline styles to the element.
   * Uses Map-based storage for O(1) property filtering instead of O(n) string parsing.
   *
   * @param {HTMLElement} target - The element whose styles should be restored.
   * @param {string[]} [stylesToFilterOut] - Optional array of CSS property names to exclude from restoration.
   */
  const restoreOriginalStyles = (target: HTMLElement, stylesToFilterOut?: string[]) => {
    const originalStyleMap = originalStyles.get(target)

    if (originalStyleMap) {
      // Create a new Map with filtered properties (instant O(1) lookup)
      const filteredStyleMap = new Map(originalStyleMap)

      if (stylesToFilterOut && stylesToFilterOut.length) {
        stylesToFilterOut.forEach((property) => {
          filteredStyleMap.delete(property)
        })
      }

      // Apply the filtered styles or remove the style attribute if empty
      if (filteredStyleMap.size > 0) {
        const styleString = styleMapToString(filteredStyleMap)
        target.setAttribute('style', styleString)
      } else {
        target.removeAttribute('style')
      }
    } else {
      target.removeAttribute('style')
    }

    // Remove the class and delete the original style entry
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
    restoreOriginalStyles(target, ['hover'])
  }

  const handleHover = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (isValidTarget(target)) {
      applyHoverStyles(target)
      onHover(target, event.clientX, event.clientY)
    }
  }

  const handleMouseOutInternal = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (isValidTarget(target) && target.classList.contains('ruio-hovered')) {
      removeHoverStyles(target)
    }
    onMouseOut?.()
  }

  const handleClick = (event: MouseEvent) => {
    event.preventDefault()

    const target = event.target as HTMLElement
    if (isValidTarget(target)) {
      setConfigValueAtKey('rootElementSelector', parseSelectorFromSelectedElement(target))

      removeHoverStyles(target)
      onClick(target)
      cleanup()
    }
  }

  document.body.addEventListener('mouseover', handleHover)
  document.body.addEventListener('mouseout', handleMouseOutInternal)
  document.body.addEventListener('click', handleClick)

  const cleanup = () => {
    document.body.removeEventListener('mouseover', handleHover)
    document.body.removeEventListener('mouseout', handleMouseOutInternal)
    document.body.removeEventListener('click', handleClick)
  }

  return cleanup
}
