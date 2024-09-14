const DEFAULT_ROOT_ELEMENT = 'root' // adjust this to match the root element id in your project

export const smartHover = (
  onHover: (element: HTMLElement) => void,
  onClick?: (element: HTMLElement) => void,
) => {
  const rootElement = document.querySelector(`#${DEFAULT_ROOT_ELEMENT}`) as HTMLElement

  if (!rootElement) {
    console.error('Root element not found!')
    return
  }

  // Hover on effect
  const handleHover = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.classList.contains('ruio-exclude')) {
      return
    }
    console.log('Hover event triggered', target)

    // Skip highlighting the root element and its parents (html, body)
    if (target.closest('#root') && target !== rootElement) {
      console.log('Element being hovered:', target)
      target.style.outline = '2px dashed blue' // Highlight hovered element
      target.style.backgroundColor = 'rgba(0, 0, 255, 0.1)' // Highlight hovered element
      onHover(target)
    }
  }

  // Hover off effect
  const handleMouseOut = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.classList.contains('ruio-exclude')) {
      return
    }
    console.log('MouseOut event triggered', target)

    if (target.closest('#root') && target !== rootElement) {
      target.style.outline = '' // Remove hover outline
      target.style.backgroundColor = '' // Remove hover background color
    }
  }

  // Click while hovering effect
  const handleSelect = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.classList.contains('ruio-exclude')) {
      return
    }
    console.log('Click event triggered', target)

    if (target.closest('#root') && target !== rootElement && onClick) {
      target.style.outline = '' // Remove hover outline
      target.style.backgroundColor = '' // Remove hover background color

      onClick(target)
    }
  }

  document.body.addEventListener('mouseover', handleHover)
  document.body.addEventListener('mouseout', handleMouseOut)
  document.body.addEventListener('click', handleSelect)

  return () => {
    console.log('Cleaning up event listeners')
    document.body.removeEventListener('mouseover', handleHover)
    document.body.removeEventListener('mouseout', handleMouseOut)
    document.body.removeEventListener('click', handleSelect)
  }
}
