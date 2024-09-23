import { getRelativeDepthColor } from '@utils/assignBorderColor'

export let previouslyAppliedElements: Set<HTMLElement> = new Set()

// TODO: add root class or id configuration to settings icon modal
// TODO: offer a way to toggle between Sets and Array for previouslyAppliedElements (performance for small vs. large data sets)
// ref. sha for original transition from Array to Set: a1808d5fd72213a86fcc827416e4a6c8891cd1db
export const applyOutlineUI = (element: HTMLElement, depth: number, apply: boolean) => {
  if (element && element.classList.contains('ruio-exclude')) return
  const elements = new Set<HTMLElement>()

  const traverse = (el: HTMLElement, currentDepth: number) => {
    if (!el || currentDepth > depth) return // NOTE: temporary, while we get depth-down figure out

    if (el.classList.contains('ruio-exclude') || el.tagName === 'SCRIPT') return

    elements.add(el)

    // Apply styles only when necessary
    requestAnimationFrame(() => {
      // TODO: not too optimal to constantly lookup rahter than load the hex index based off state
      el.style.outline = apply ? `2px solid ${getRelativeDepthColor('neon', currentDepth)}` : ''
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
