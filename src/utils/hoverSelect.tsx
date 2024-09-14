// src/utils/hoverSelect.ts

export const hoverSelect = (onSelect: (element: HTMLElement) => void) => {
  // Change the cursor to 'crosshair' when in selection mode
  document.body.style.cursor = 'crosshair'

  // Hover effect to outline hovered elements
  const handleHover = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.classList.contains('no-border')) {
      target.style.outline = '2px solid blue' // Highlight hovered element
    }
  }

  // Remove the outline when the mouse leaves the element
  const handleMouseOut = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.classList.contains('no-border')) {
      target.style.outline = '' // Remove hover outline
    }
  }

  // Click event to select an element
  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    onSelect(target) // Pass the selected element to the callback

    // Reset the cursor back to 'default' after selection
    document.body.style.cursor = 'default'

    // Remove the event listeners after selection
    document.body.removeEventListener('mouseover', handleHover)
    document.body.removeEventListener('mouseout', handleMouseOut)
    document.body.removeEventListener('click', handleClick)
  }

  // Attach event listeners for hover and click
  document.body.addEventListener('mouseover', handleHover)
  document.body.addEventListener('mouseout', handleMouseOut)
  document.body.addEventListener('click', handleClick)
}
