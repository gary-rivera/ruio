import { getRelativeDepthColor, colorPalettesMap } from '@utils/colorPalettes'

export let previouslyAppliedElements: Set<HTMLElement> = new Set()

// TODO: add root class or id configuration to settings icon modal
// TODO: offer a way to toggle between Sets and Array for previouslyAppliedElements (performance for small vs. large data sets)
// ref. sha for original transition from Array to Set: a1808d5fd72213a86fcc827416e4a6c8891cd1db
export const applyOutlineUI = ({
  element,
  depth,
  currentColorPalette,
  styleProp = 'outline',
}: {
  element: HTMLElement
  depth: number
  currentColorPalette: string
  styleProp?: string
}) => {
  if (!currentColorPalette) {
    console.warn('currentColorPalette is undefined; defaulting to "default" palette.')
    currentColorPalette = 'default'
  }

  const colors = colorPalettesMap[currentColorPalette]
  const elements = new Set<HTMLElement>()

  const traverse = (el: HTMLElement, currentDepth: number) => {
    if (!el || currentDepth > depth) return // NOTE: temporary, while we get depth-down figure out

    if (el.tagName === 'SCRIPT') return

    // NOTE: does this ever get cleaned up? or does the set just grow indefinitely?
    elements.add(el)

    // Apply styles only when necessary
    requestAnimationFrame(() => {
      const outlineColor = getRelativeDepthColor(colors, currentDepth)
      el.style.outline = `2px solid ${outlineColor}`
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
      if (!elements.has(el)) el.style.outline = ''
    })

    previouslyAppliedElements = elements
  })
}

// Export a reset function for testing
export const resetPreviouslyAppliedElements = () => {
  previouslyAppliedElements.clear()
}
