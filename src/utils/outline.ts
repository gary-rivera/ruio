// sha for original transition from Array to Set: a1808d5fd72213a86fcc827416e4a6c8891cd1db
import { getRelativeDepthColor, colorPalettesMap } from '@utils/colorPalettes'
import { generateContrastingColor } from '@utils/colorContrast'

export let previouslyAppliedElements: Set<HTMLElement> = new Set()

// Cache for dynamic color calculations - cleared when root element changes or palette changes
// Key format: `${elementUniqueId}_${depth}`
let dynamicColorCache: Map<string, string> = new Map()
let cacheRootElement: HTMLElement | null = null
let cachePalette: string | null = null

// TODO: offer a way to toggle between Sets and Array for previouslyAppliedElements (performance for small vs. large data sets)

// Generate a unique key for caching based on element attributes
const getElementCacheKey = (el: HTMLElement, depth: number): string => {
  // Use a combination of attributes that uniquely identify the element and its position in the DOM
  const id = el.id || ''
  const className = el.className || ''
  const tagName = el.tagName
  const pathIndex = Array.from(el.parentElement?.children || []).indexOf(el)

  return `${tagName}_${id}_${className}_${pathIndex}_${depth}`
}

export const applyOutlineUI = (
  element: HTMLElement,
  depth: number,
  apply: boolean,
  currentColorPalette: string,
) => {
  if (!currentColorPalette) {
    console.warn('currentColorPalette is undefined; defaulting to "dynamic" palette.')
    currentColorPalette = 'dynamic'
  }

  // Clear cache if root element or palette changed
  if (cacheRootElement !== element || cachePalette !== currentColorPalette) {
    dynamicColorCache.clear()
    cacheRootElement = element
    cachePalette = currentColorPalette
  }

  const colors = colorPalettesMap[currentColorPalette]
  const elements = new Set<HTMLElement>()
  const isDynamicPalette = currentColorPalette === 'dynamic'

  const traverse = (el: HTMLElement, currentDepth: number) => {
    if (!el || currentDepth > depth) return

    if (el.tagName === 'SCRIPT') return

    elements.add(el)

    requestAnimationFrame(() => {
      let outlineColor: string

      if (isDynamicPalette) {
        // Try to get from cache first
        const cacheKey = getElementCacheKey(el, currentDepth)
        const cachedColor = dynamicColorCache.get(cacheKey)

        if (cachedColor) {
          outlineColor = cachedColor
        } else {
          // Calculate and cache the color
          outlineColor = generateContrastingColor(el, currentDepth)
          dynamicColorCache.set(cacheKey, outlineColor)
        }
      } else {
        outlineColor = getRelativeDepthColor(colors, currentDepth)
      }

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

// for testing and manual cache clearing
export const clearDynamicColorCache = () => {
  dynamicColorCache.clear()
  cacheRootElement = null
  cachePalette = null
}
