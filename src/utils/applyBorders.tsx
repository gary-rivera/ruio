let previouslyAppliedElements: HTMLElement[] = []

export const applyBorders = (element: HTMLElement, depth: number, apply: boolean) => {
  const elements: HTMLElement[] = []
  const x = 0

  const traverse = (el: HTMLElement, currentDepth: number) => {
    // if (['SCRIPT'].includes(el.tagName) || el.id === 'root') return

    if (currentDepth > depth) return
    if (el.classList.contains('ruio-exclude') || el.tagName === 'SCRIPT') return
    elements.push(el)

    el.style.outline = apply ? '2px solid red' : ''

    Array.from(el.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        traverse(child, currentDepth + 1)
      }
    })
  }

  if (apply) {
    element.classList.add('ruio-inject-base')
  } else {
    element.classList.remove('ruio-inject-base')
  }

  traverse(element, 0)

  // When lowering the depth, we remove borders from previously applied elements that are now beyond the new depth
  if (previouslyAppliedElements.length > 0) {
    previouslyAppliedElements.forEach((el) => {
      if (!elements.includes(el)) {
        el.style.outline = '' // Remove the border if the element is no longer within the current depth
      }
    })
  }

  // Update the list of elements with applied borders
  previouslyAppliedElements = elements
}
