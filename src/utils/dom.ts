/**
 * Checks if an element takes up the entire viewport (or nearly all of it).
 * Elements that fill the viewport are typically not useful to inspect.
 *
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} - True if the element fills 95% or more of the viewport.
 */
export const isFullViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  const viewportThreshold = 0.95

  return (
    rect.width >= window.innerWidth * viewportThreshold &&
    rect.height >= window.innerHeight * viewportThreshold
  )
}

/**
 * Parses inline style string into a Map of property-value pairs.
 *
 * @param {string} styleString - The inline style string to parse.
 * @returns {Map<string, string>} - Map of CSS property to value.
 */
export const parseStyleString = (styleString: string): Map<string, string> => {
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
 * Converts a Map of style properties to an inline style string.
 *
 * @param {Map<string, string>} styleMap - Map of CSS property to value.
 * @returns {string} - Inline style string.
 */
export const styleMapToString = (styleMap: Map<string, string>): string => {
  const styles: string[] = []
  styleMap.forEach((value, property) => {
    styles.push(`${property}: ${value}`)
  })
  return styles.join('; ')
}

export function shouldSkipElement(el: HTMLElement): boolean {
  return !el || el.tagName === 'SCRIPT'
}

export function getElementsChildren(el: HTMLElement): HTMLElement[] {
  return Array.from(el.children).filter((child) => child instanceof HTMLElement) as HTMLElement[]
}
