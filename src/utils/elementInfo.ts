import { parseSelectorFromSelectedElement } from './config'
import { DEFAULT_MAX_DEPTH } from '@constants/index'

/**
 * best-effort extraction of a components name
 * works with functional, class, and composite components (Tab, etc.)
 */
export const getReactComponentName = (element: HTMLElement): string | null => {
  try {
    // try to parse React Fiber key
    const reactFiberKey = Object.keys(element).find(
      (key) => key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance'),
    )
    if (!reactFiberKey) return null

    // ref: https://blog.logrocket.com/deep-dive-react-fiber/
    const reactFiber = (element as any)[reactFiberKey] // ew but not worth it rn
    if (!reactFiber) return null

    let currentFiber = reactFiber
    while (currentFiber) {
      const { type, _debugOwner } = currentFiber

      if (!type) {
        currentFiber = currentFiber.return
        continue
      }

      // function/class component
      if (typeof type === 'function') {
        const componentName = type.displayName || type.name
        const isValidComponentName = componentName && componentName !== 'Anonymous'
        if (isValidComponentName) {
          return componentName
        }
      }

      // composite components
      const ownerType = _debugOwner?.type
      if (ownerType && typeof ownerType === 'function') {
        // , try to get owner info
        const ownerComponentName = ownerType.displayName || ownerType.name
        const isValidOwnerName = ownerComponentName && ownerComponentName !== 'Anonymous'

        if (isValidOwnerName) {
          return ownerComponentName
        }
      }

      currentFiber = currentFiber.return
    }
  } catch (error) {
    // silently fail - this is a best-effort extraction
  }

  return null
}

/**
 * gets the HTML tag name from an element, wraps in '<>'
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
    if (currentDepth > DEFAULT_MAX_DEPTH) {
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
 * gets the count of direct HTML children (excluding text nodes, comments, etc.)
 */
export const getChildrenCount = (element: HTMLElement): number => {
  return Array.from(element.children).filter((child) => child instanceof HTMLElement).length
}

/**
 * gets the parent tag name, or null if no parent
 */
export const getParentTag = (element: HTMLElement): string | null => {
  if (!element.parentElement) return null
  return `<${element.parentElement.tagName.toLowerCase()}>`
}

/**
 * gets the first child tag name, or null if no children
 */
export const getFirstChildTag = (element: HTMLElement): string | null => {
  const firstChild = Array.from(element.children).find((child) => child instanceof HTMLElement) as
    | HTMLElement
    | undefined
  if (!firstChild) return null
  return `<${firstChild.tagName.toLowerCase()}>`
}

/**
 * gets the count of siblings (i.e. elements with the same parent)
 */
export const getSiblingsCount = (element: HTMLElement): number => {
  if (!element.parentElement) return 0
  const siblings = Array.from(element.parentElement.children).filter(
    (child) => child instanceof HTMLElement && child !== element,
  )
  return siblings.length
}

/**
 * gathers relevant info about an element
 */
export const getElementInfo = (element: HTMLElement) => {
  return {
    // React component info
    reactComponentName: getReactComponentName(element),

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
