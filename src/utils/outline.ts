import { getRelativeDepthColor, colorPalettesMap } from '@utils/colorPalettes'
import { generateContrastingColor } from '@utils/dynamicColorGeneration'
import { getElementsChildren, shouldSkipElement } from './dom'

const HOVER_BG_COLOR = 'rgba(153, 181, 214, 0.66)'

// local state variables (avoids having to do expensive actual cache pulls)
// these & caching variables allow dom related changes to occur directly rather than going through react (avoids re-renders)
export let selectedOutlineElements: Set<HTMLElement> = new Set() // exported for testing
let previewOutlineElements: Set<HTMLElement> = new Set()
let originalBackgroundColors: Map<HTMLElement, string> = new Map()

// ===== CACHING ========
let colorCache: Map<string, string> = new Map()
let cachedRootElement: HTMLElement | null = null
let cachedPalette: string | null = null

function getElementCacheKey(el: HTMLElement, depth: number): string {
  const id = el.id || ''
  const className = el.className || ''
  const tagName = el.tagName
  const pathIndex = Array.from(el.parentElement?.children || []).indexOf(el)

  return `${tagName}_${id}_${className}_${pathIndex}_${depth}`
}

function invalidateCacheIfChanged(element: HTMLElement, palette: string): void {
  if (cachedRootElement !== element || cachedPalette !== palette) {
    colorCache.clear()
    cachedRootElement = element
    cachedPalette = palette
  }
}

function getColorForElement(el: HTMLElement, depth: number, palette: string): string {
  const isDynamic = palette === 'dynamic'

  if (isDynamic) {
    const cacheKey = getElementCacheKey(el, depth)
    const cached = colorCache.get(cacheKey)

    if (cached) return cached

    const color = generateContrastingColor(el, depth)
    colorCache.set(cacheKey, color)

    return color
  }

  const colors = colorPalettesMap[palette]
  return getRelativeDepthColor(colors, depth)
}

export function clearColorCache(): void {
  colorCache.clear()
  cachedRootElement = null
  cachedPalette = null
}

// ===== STYLE APPLICATION ========
interface OutlineStyleConfig {
  color: string
  style: 'solid' | 'dashed'
  offset?: string
  backgroundColor?: string
}

function applyOutlineStyle(el: HTMLElement, config: OutlineStyleConfig): void {
  el.style.outline = `2px ${config.style} ${config.color}`

  if (config.offset) {
    el.style.outlineOffset = config.offset
  }

  if (config.backgroundColor) {
    if (!originalBackgroundColors.has(el)) {
      originalBackgroundColors.set(el, el.style.backgroundColor)
    }
    el.style.backgroundColor = config.backgroundColor
  }
}

function clearOutlineStyle(el: HTMLElement, clearBackground = false): void {
  el.style.outline = ''
  el.style.outlineOffset = ''

  if (clearBackground && originalBackgroundColors.has(el)) {
    el.style.backgroundColor = originalBackgroundColors.get(el) || ''
    originalBackgroundColors.delete(el)
  }
}

interface TraversalConfig {
  maxDepth: number
  palette: string
  onElement: (el: HTMLElement, depth: number, color: string) => void
}

interface OutlineOperations {
  elements: Set<HTMLElement>
  styleOperationsQueue: Array<() => void>
}

function traverseAndQueueOutlines(element: HTMLElement, config: TraversalConfig): OutlineOperations {
  const elements: Set<HTMLElement> = new Set()
  const styleOperationsQueue: Array<() => void> = []

  const traverse = (el: HTMLElement, currentDepth: number) => {
    if (shouldSkipElement(el) || currentDepth > config.maxDepth) return

    elements.add(el)

    styleOperationsQueue.push(() => {
      const color = getColorForElement(el, currentDepth, config.palette)
      config.onElement(el, currentDepth, color)
    })

    getElementsChildren(el).forEach((child) => {
      traverse(child, currentDepth + 1)
    })
  }

  traverse(element, 0)
  return { elements, styleOperationsQueue }
}

// ===== MAIN UTIL API ========
export const applySelectedOutlines = (
  element: HTMLElement,
  depth: number,
  apply: boolean,
  currentColorPalette: string,
) => {
  if (!currentColorPalette) {
    console.warn('currentColorPalette is undefined; defaulting to "dynamic" palette.')
    currentColorPalette = 'dynamic'
  }

  invalidateCacheIfChanged(element, currentColorPalette)

  const { elements, styleOperationsQueue } = traverseAndQueueOutlines(element, {
    maxDepth: depth,
    palette: currentColorPalette,
    onElement: (el, _, color) => {
      el.style.outline = apply ? `2px solid ${color}` : ''
    },
  })

  requestAnimationFrame(() => {
    styleOperationsQueue.forEach((op) => op())

    selectedOutlineElements.forEach((el) => {
      if (!elements.has(el)) {
        el.style.outline = ''
      }
    })

    selectedOutlineElements = elements
  })
}

export const applyPreviewOutlines = (
  element: HTMLElement,
  depth: number,
  currentColorPalette: string,
) => {
  if (!currentColorPalette) {
    console.warn('currentColorPalette is undefined; defaulting to "dynamic" palette.')
    currentColorPalette = 'dynamic'
  }

  const { elements, styleOperationsQueue } = traverseAndQueueOutlines(element, {
    maxDepth: depth,
    palette: currentColorPalette,
    onElement: (el, currentDepth, color) => {
      applyOutlineStyle(el, {
        color,
        style: 'dashed',
        offset: '2px',
        backgroundColor: currentDepth === 0 ? HOVER_BG_COLOR : undefined,
      })
    },
  })

  requestAnimationFrame(() => {
    styleOperationsQueue.forEach((op) => op())

    previewOutlineElements.forEach((el) => {
      if (!elements.has(el)) {
        clearOutlineStyle(el, true)
      }
    })

    previewOutlineElements = elements
  })
}

export const clearPreviewOutlines = () => {
  requestAnimationFrame(() => {
    previewOutlineElements.forEach((el) => {
      clearOutlineStyle(el, true)
    })

    previewOutlineElements.clear()
  })
}

export const clearSelectedOutlines = () => {
  requestAnimationFrame(() => {
    selectedOutlineElements.forEach((el) => {
      clearOutlineStyle(el, false)
    })

    selectedOutlineElements.clear()
  })
}

export const calculateMaxDepth = (element: HTMLElement | null): number => {
  if (!element) return 0

  let maxDepthFound = 0

  const traverseAndTrackDepth = (el: HTMLElement, currentDepth: number) => {
    if (shouldSkipElement(el)) return

    maxDepthFound = Math.max(maxDepthFound, currentDepth)

    getElementsChildren(el).forEach((child) => {
      traverseAndTrackDepth(child, currentDepth + 1)
    })
  }

  traverseAndTrackDepth(element, 0)
  return maxDepthFound
}
