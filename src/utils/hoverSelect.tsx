// TODO: rename to smartHover or something similar
export const hoverSelect = (
  onHover: (element: HTMLElement) => void,
  // onClick?: (element: HTMLElement) => void,
) => {
  // TODO: make the root element configurable/applicable to a specific root eleement if needed
  const rootElement = document.getElementById('root') // Reference to the current root element

  if (!rootElement) {
    console.error('Root element not found!')
    return
  }

  // Hover on effect
  const handleHover = (event: MouseEvent) => {
    const target = event.target as HTMLElement

    // Skip highlighting the root element and its parents (html, body)
    if (target.closest('#root') && target !== rootElement) {
      target.style.outline = '2px dashed blue' // Highlight hovered element
      target.style.backgroundColor = 'rgba(0, 0, 255, 0.1)' // Highlight hovered element
      onHover(target)
    }
  }

  // Hover off effect
  const handleMouseOut = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.closest('#root') && target !== rootElement) {
      target.style.outline = '' // Remove hover outline
      target.style.backgroundColor = '' // Remove hover background color
    }
  }

  // Click while hovering effect
  const handleSelect = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.closest('#root') && target !== rootElement) {
      target.style.outline = '' // Remove hover outline
      target.style.backgroundColor = '' // Remove hover background color

      // Call onHover to handle element hover logic, if needed
      onHover(target)

      // Call onClick to handle click-specific logic
      // onClick && onClick(target)

      // Optionally remove the hover listeners or perform additional logic
      // Clean up hover listeners if you want to disable hover on click
    }
  }

  // Attach hover listeners
  document.body.addEventListener('mouseover', handleHover)
  document.body.addEventListener('mouseout', handleMouseOut)
  document.body.addEventListener('click', handleSelect)

  // Return a cleanup function to remove the event listeners when needed
  return () => {
    document.body.removeEventListener('mouseover', handleHover)
    document.body.removeEventListener('mouseout', handleMouseOut)
    document.body.removeEventListener('click', handleSelect)
  }
}
