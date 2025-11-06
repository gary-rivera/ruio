// sha for original transition from Array to Set: a1808d5fd72213a86fcc827416e4a6c8891cd1db
import { getRelativeDepthColor, colorPalettesMap } from '@utils/colorPalettes'

export let previouslyAppliedElements: Set<HTMLElement> = new Set()

// TODO: add root class or id configuration to settings icon modal
// TODO: offer a way to toggle between Sets and Array for previouslyAppliedElements (performance for small vs. large data sets)

export const applyOutlineUI = (
  element: HTMLElement,
  depth: number,
  apply: boolean,
  currentColorPalette: string,
) => {
  if (!currentColorPalette) {
    console.warn('currentColorPalette is undefined; defaulting to "default" palette.')
    currentColorPalette = 'default'
  }

  const colors = colorPalettesMap[currentColorPalette]
  const elements = new Set<HTMLElement>()

  const traverse = (el: HTMLElement, currentDepth: number) => {
    if (!el || currentDepth > depth) return

    if (el.tagName === 'SCRIPT') return

    elements.add(el)

    requestAnimationFrame(() => {
      const outlineColor = getRelativeDepthColor(colors, currentDepth)
      el.style.outline = apply ? `2px solid ${outlineColor}` : ''
    })

    Array.from(el.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        traverse(child, currentDepth + 1)
      }
    })
  }

  traverse(element, 0)

  requestAnimationFrame(() => {
    previouslyAppliedElements.forEach((el) => {
      // Remove outline if not in the new set of elements
      // NOTE: this may overwrite elements that have an outline style already applied
      if (!elements.has(el)) el.style.outline = ''
    })

    previouslyAppliedElements = elements
  })
}

/**
 * Calculates the maximum depth of the DOM tree starting from a root element.
 * Ignores script tags and counts the deepest path from root to leaf.
 *
 * @param element - The root element to calculate depth from
 * @returns The maximum depth (0 for elements with no children)
 */
export const calculateMaxDepth = (element: HTMLElement | null): number => {
  if (!element) return 0

  let maxDepthFound = 0

  const shouldSkipElement = (el: HTMLElement) => !el || el.tagName === 'SCRIPT'

  const getHtmlElementChildren = (el: HTMLElement): HTMLElement[] => {
    return Array.from(el.children).filter((child) => child instanceof HTMLElement) as HTMLElement[]
  }

  const traverseAndTrackDepth = (el: HTMLElement, currentDepth: number) => {
    if (shouldSkipElement(el)) return

    maxDepthFound = Math.max(maxDepthFound, currentDepth)

    const childElements = getHtmlElementChildren(el)
    childElements.forEach((child) => {
      traverseAndTrackDepth(child, currentDepth + 1)
    })
  }

  traverseAndTrackDepth(element, 0)
  return maxDepthFound
}

// for testing
export const resetPreviouslyAppliedElements = () => {
  previouslyAppliedElements.clear()
}
