import { setConfigValueAtKey, parseSelectorFromSelectedElement } from '@utils/config'
import { isFullViewport } from '@utils/dom'

/**
 * event delegator for element picker related interactions
 * delegates: clicks, mouseOver, and mouseOut
 *
 * @param {function(HTMLElement): void} onClick - Callback invoked when an element is clicked.
 * @param {function(HTMLElement, number, number): void} onMouseOver - Callback invoked when an element is hovered. Receives element and mouse coordinates.
 * @param {function(): void} onMouseOut - Optional callback invoked when mouse leaves an element.
 * @returns {function(): void} - A cleanup function that removes all attached event listeners.
 */
export const ElementPicker = (
  onClick: (element: HTMLElement) => void,
  onMouseOver: (element: HTMLElement, x: number, y: number) => void,
  onMouseOut?: () => void,
) => {
  const isValidTarget = (target: HTMLElement) => {
    const targetIsDescendantOfRuio = target.closest('[id^="ruio-exclude"]')
    const targetFillsViewport = isFullViewport(target)

    return !targetIsDescendantOfRuio && !targetFillsViewport
  }

  const handleMouseOver = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (isValidTarget(target)) {
      onMouseOver(target, event.clientX, event.clientY)
    }
  }

  const handleMouseOut = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (isValidTarget(target) && onMouseOut) {
      onMouseOut()
    }
  }

  const handleClick = (event: MouseEvent) => {
    event.preventDefault()

    const target = event.target as HTMLElement
    if (isValidTarget(target)) {
      setConfigValueAtKey('rootElementSelector', parseSelectorFromSelectedElement(target))
      onClick(target)
      cleanup()
    }
  }

  document.body.addEventListener('mouseover', handleMouseOver)
  document.body.addEventListener('mouseout', handleMouseOut)
  document.body.addEventListener('click', handleClick)

  const cleanup = () => {
    document.body.removeEventListener('mouseover', handleMouseOver)
    document.body.removeEventListener('mouseout', handleMouseOut)
    document.body.removeEventListener('click', handleClick)
  }

  return cleanup
}
