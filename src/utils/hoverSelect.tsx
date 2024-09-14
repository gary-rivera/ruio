export const hoverSelect = (onHover: (element: HTMLElement) => void) => {
  // TODO: make the root element configurable/applicable to a specific root eleement if needed
  const rootElement = document.getElementById('root') // Reference to the root element

  if (!rootElement) {
    console.error('Root element not found!')
    return
  }

  // Hover effect to highlight elements below the root
  const handleHover = (event: MouseEvent) => {
    const target = event.target as HTMLElement

    // Skip highlighting the root element and its parents (html, body)
    if (target.closest('#root') && target !== rootElement) {
      target.style.outline = '2px dashed blue' // Highlight hovered element
      target.style.backgroundColor = 'rgba(0, 0, 255, 0.1)' // Highlight hovered element
      onHover(target)
    }
  }

  // Remove the outline when the mouse leaves the element
  const handleMouseOut = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.closest('#root') && target !== rootElement) {
      target.style.outline = '' // Remove hover outline
      target.style.backgroundColor = '' // Remove hover background color
    }
  }

  // Attach hover listeners
  document.body.addEventListener('mouseover', handleHover)
  document.body.addEventListener('mouseout', handleMouseOut)

  // Return a cleanup function to remove the event listeners when needed
  return () => {
    document.body.removeEventListener('mouseover', handleHover)
    document.body.removeEventListener('mouseout', handleMouseOut)
  }
}
