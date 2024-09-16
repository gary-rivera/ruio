import { getRelativeDepthColor } from '@utils/assignBorderColor'
// only exposed for testing (for now)
export let previouslyAppliedElements: HTMLElement[] = []

export const applyBorders = (element: HTMLElement, depth: number, apply: boolean) => {
  const elements: HTMLElement[] = []

  const traverse = (el: HTMLElement, currentDepth: number) => {
    if (currentDepth > depth) return
    if (el.classList.contains('ruio-exclude') || el.tagName === 'SCRIPT') return

    elements.push(el)

    el.style.outline = apply ? `2px solid ${getRelativeDepthColor('dark', currentDepth)}` : ''

    Array.from(el.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        traverse(child, currentDepth + 1)
      }
    })
  }

  traverse(element, 0)

  if (previouslyAppliedElements.length > 0) {
    previouslyAppliedElements.forEach((el) => {
      // Remove the border styling from elements that are no longer in the list
      if (!elements.includes(el)) el.style.outline = ''
    })
  }

  previouslyAppliedElements = elements
}

// Export a reset function for testing
// tl;dr - encapsulation of logic is important to avoid false positives in tests
export const resetPreviouslyAppliedElements = () => {
  previouslyAppliedElements = []
}
