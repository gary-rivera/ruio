import { parseSelectorFromSelectedElement } from './config'

const MAX_DEPTH_LIMIT = 100 // Performance threshold

/**
 * Attempts to extract the React component name from an element.
 * Returns null if not a React component or if name cannot be determined.
 */
export const getReactComponentName = (element: HTMLElement): string | null => {
  try {
    // Try to find React Fiber key (React 16+)
    const fiberKey = Object.keys(element).find(
      (key) => key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance'),
    )

    if (!fiberKey) return null

    const fiber = (element as any)[fiberKey]
    if (!fiber) return null

    // Walk up the fiber tree to find the nearest component
    let currentFiber = fiber
    while (currentFiber) {
      const { type, _debugSource, _debugOwner } = currentFiber

      // Check if this fiber has a component type
      if (type) {
        // Function/Class component
        if (typeof type === 'function') {
          const name = type.displayName || type.name
          if (name && name !== 'Anonymous') {
            return name
          }
        }

        // For composite components, try to get owner info
        if (_debugOwner?.type) {
          const ownerType = _debugOwner.type
          if (typeof ownerType === 'function') {
            const ownerName = ownerType.displayName || ownerType.name
            if (ownerName && ownerName !== 'Anonymous') {
              return ownerName
            }
          }
        }
      }

      // Move up the fiber tree
      currentFiber = currentFiber.return
    }
  } catch (error) {
    // Silently fail - this is a best-effort extraction
  }

  return null
}

/**
 * Gets the HTML tag name from an element.
 */
export const getTagName = (element: HTMLElement): string => {
  return `<${element.tagName.toLowerCase()}>`
}

/**
 * Calculates the maximum depth of the DOM tree starting from a root element.
 * Returns 'MAX_DEPTH_EXCEEDED' if depth exceeds performance threshold.
 *
 * @param element - The root element to calculate depth from
 * @returns The maximum depth or 'MAX_DEPTH_EXCEEDED'
 */
export const calculateElementDepth = (element: HTMLElement | null): number | 'MAX_DEPTH_EXCEEDED' => {
  if (!element) return 0

  let maxDepthFound = 0
  let exceeded = false

  const shouldSkipElement = (el: HTMLElement) => !el || el.tagName === 'SCRIPT'

  const getHtmlElementChildren = (el: HTMLElement): HTMLElement[] => {
    return Array.from(el.children).filter((child) => child instanceof HTMLElement) as HTMLElement[]
  }

  // tl;dr depth first, increment depth count for each valid stack
  const traverseAndTrackDepth = (el: HTMLElement, currentDepth: number) => {
    if (shouldSkipElement(el)) return

    // Early exit if we've exceeded the limit
    if (currentDepth > MAX_DEPTH_LIMIT) {
      exceeded = true
      return
    }

    maxDepthFound = Math.max(maxDepthFound, currentDepth)

    // Only continue if we haven't exceeded
    if (!exceeded) {
      const childElements = getHtmlElementChildren(el)
      for (const child of childElements) {
        traverseAndTrackDepth(child, currentDepth + 1)
        if (exceeded) break // Stop early
      }
    }
  }

  traverseAndTrackDepth(element, 0)

  return exceeded ? 'MAX_DEPTH_EXCEEDED' : maxDepthFound
}

/**
 * Gets the count of direct HTML children (excluding text nodes, comments, etc.)
 */
export const getChildrenCount = (element: HTMLElement): number => {
  return Array.from(element.children).filter((child) => child instanceof HTMLElement).length
}

/**
 * Gets the parent tag name, or null if no parent
 */
export const getParentTag = (element: HTMLElement): string | null => {
  if (!element.parentElement) return null
  return `<${element.parentElement.tagName.toLowerCase()}>`
}

/**
 * Gets the React component name of the parent element, or null if not found
 */
export const getParentComponentName = (element: HTMLElement): string | null => {
  if (!element.parentElement) return null
  return getReactComponentName(element.parentElement)
}

/**
 * Gets the first child tag name, or null if no children
 */
export const getFirstChildTag = (element: HTMLElement): string | null => {
  const firstChild = Array.from(element.children).find((child) => child instanceof HTMLElement) as
    | HTMLElement
    | undefined
  if (!firstChild) return null
  return `<${firstChild.tagName.toLowerCase()}>`
}

/**
 * Gets the React component name of the first child element, or null if not found
 */
export const getFirstChildComponentName = (element: HTMLElement): string | null => {
  const firstChild = Array.from(element.children).find((child) => child instanceof HTMLElement) as
    | HTMLElement
    | undefined
  if (!firstChild) return null
  return getReactComponentName(firstChild)
}

/**
 * Gets the count of siblings (elements with the same parent)
 */
export const getSiblingsCount = (element: HTMLElement): number => {
  if (!element.parentElement) return 0
  const siblings = Array.from(element.parentElement.children).filter(
    (child) => child instanceof HTMLElement && child !== element,
  )
  return siblings.length
}

/**
 * Gathers all information about an element for the tooltip.
 */
export const getElementInfo = (element: HTMLElement) => {
  return {
    // React component info
    reactComponentName: getReactComponentName(element),
    parentComponentName: getParentComponentName(element),
    firstChildComponentName: getFirstChildComponentName(element),

    // HTML/CSS info
    tagName: getTagName(element),
    parentTag: getParentTag(element),
    firstChildTag: getFirstChildTag(element),
    selector: parseSelectorFromSelectedElement(element),

    // Metrics
    depth: calculateElementDepth(element),
    childrenCount: getChildrenCount(element),
    siblingsCount: getSiblingsCount(element),
  }
}
