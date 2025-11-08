// sha for original transition from Array to Set: a1808d5fd72213a86fcc827416e4a6c8891cd1db
import { getRelativeDepthColor, colorPalettesMap } from '@utils/colorPalettes'
import { generateContrastingColor } from '@utils/colorContrast'

// Committed outlines (selected root element)
export let committedOutlineElements: Set<HTMLElement> = new Set()

// Preview outlines (hover during selection mode)
let previewOutlineElements: Set<HTMLElement> = new Set()

// Cache for color calculations - cleared when root element changes or palette changes
// Key format: `${elementUniqueId}_${depth}`
let colorCache: Map<string, string> = new Map()
let cachedRootElement: HTMLElement | null = null
let cachedPalette: string | null = null

// TODO: offer a way to toggle between Sets and Array for committedOutlineElements (performance for small vs. large data sets)

// Generate a unique key for caching based on element attributes
const getElementCacheKey = (el: HTMLElement, depth: number): string => {
  // Use a combination of attributes that uniquely identify the element and its position in the DOM
  const id = el.id || ''
  const className = el.className || ''
  const tagName = el.tagName
  const pathIndex = Array.from(el.parentElement?.children || []).indexOf(el)

  return `${tagName}_${id}_${className}_${pathIndex}_${depth}`
}

export const applyCommittedOutlines = (
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
  if (cachedRootElement !== element || cachedPalette !== currentColorPalette) {
    colorCache.clear()
    cachedRootElement = element
    cachedPalette = currentColorPalette
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
        const cachedColor = colorCache.get(cacheKey)

        if (cachedColor) {
          outlineColor = cachedColor
        } else {
          // Calculate and cache the color
          outlineColor = generateContrastingColor(el, currentDepth)
          colorCache.set(cacheKey, outlineColor)
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
    committedOutlineElements.forEach((el) => {
      // Remove outline if not in the new set of elements
      // NOTE: this may overwrite elements that have an outline style already applied
      if (!elements.has(el)) el.style.outline = ''
    })

    committedOutlineElements = elements
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
export const resetCommittedOutlines = () => {
  committedOutlineElements.clear()
}

// for testing and manual cache clearing
export const clearColorCache = () => {
  colorCache.clear()
  cachedRootElement = null
  cachedPalette = null
}

/**
 * Applies temporary preview outlines during element selection mode (hover).
 * These outlines DO NOT interfere with the committed outlines from the selected root.
 * Uses a custom outline style to differentiate from committed outlines.
 *
 * @param element - The element being hovered over
 * @param depth - Maximum depth to apply outlines
 * @param currentColorPalette - Color palette to use
 */
export const applyPreviewOutlineUI = (
  element: HTMLElement,
  depth: number,
  currentColorPalette: string,
) => {
  if (!currentColorPalette) {
    console.warn('currentColorPalette is undefined; defaulting to "dynamic" palette.')
    currentColorPalette = 'dynamic'
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
        const cacheKey = getElementCacheKey(el, currentDepth)
        const cachedColor = colorCache.get(cacheKey)

        if (cachedColor) {
          outlineColor = cachedColor
        } else {
          outlineColor = generateContrastingColor(el, currentDepth)
          colorCache.set(cacheKey, outlineColor)
        }
      } else {
        outlineColor = getRelativeDepthColor(colors, currentDepth)
      }

      // Use dashed outline to differentiate preview from committed
      el.style.outline = `2px dashed ${outlineColor}`
      el.style.outlineOffset = '2px' // Slightly offset to avoid overlap with committed outlines
    })

    Array.from(el.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        traverse(child, currentDepth + 1)
      }
    })
  }

  traverse(element, 0)

  // Clean up previous preview outlines
  requestAnimationFrame(() => {
    previewOutlineElements.forEach((el) => {
      if (!elements.has(el)) {
        el.style.outline = ''
        el.style.outlineOffset = ''
      }
    })

    previewOutlineElements = elements
  })
}

/**
 * Removes all preview outlines.
 * Should be called when exiting element selection mode or when an element is selected.
 */
export const clearPreviewOutlines = () => {
  requestAnimationFrame(() => {
    previewOutlineElements.forEach((el) => {
      el.style.outline = ''
      el.style.outlineOffset = ''
    })
    previewOutlineElements.clear()
  })
}
