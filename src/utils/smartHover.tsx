const DEFAULT_ROOT_ELEMENT = 'root' // !important: adjust this to match the root element id in your project

export const smartHover = (onHoverOrClick: (element: HTMLElement) => void) => {
  const rootElement = document.querySelector(`#${DEFAULT_ROOT_ELEMENT}`) as HTMLElement

  if (!rootElement) {
    console.error(
      "[ruio][smartHover] Root element not found. Make sure your project's root element matches the DEFAULT_ROOT_ELEMENT: ",
      DEFAULT_ROOT_ELEMENT,
    )
    return
  }

  // Helper to check if the target is valid
  const isValidTarget = (target: HTMLElement) => {
    return (
      !target.classList.contains('ruio-exclude') &&
      target.closest(`#${DEFAULT_ROOT_ELEMENT}`) &&
      target !== rootElement
    )
  }

  // Helper to apply hover styles
  const applyHoverStyles = (target: HTMLElement, isHovering: boolean) => {
    target.style.outline = isHovering ? '2px dashed blue' : ''
    target.style.backgroundColor = isHovering ? 'rgba(0, 0, 255, 0.1)' : ''
  }

  const handleHover = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (isValidTarget(target)) {
      applyHoverStyles(target, true)
      onHoverOrClick(target)
    }
  }

  const handleMouseOut = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (isValidTarget(target)) {
      applyHoverStyles(target, false)
    }
  }

  const handleSelect = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (isValidTarget(target)) {
      applyHoverStyles(target, false) // Remove hover effect
      onHoverOrClick(target)
      cleanup()
    }
  }

  document.body.addEventListener('mouseover', handleHover)
  document.body.addEventListener('mouseout', handleMouseOut)
  document.body.addEventListener('click', handleSelect)

  const cleanup = () => {
    document.body.removeEventListener('mouseover', handleHover)
    document.body.removeEventListener('mouseout', handleMouseOut)
    document.body.removeEventListener('click', handleSelect)
  }

  return cleanup
}
