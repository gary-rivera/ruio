import { UI_DEPTH, COLOR_PALETTE, RUIO_ENABLED, ROOT_ELEMENT_SELECTOR } from '@constants/index'

// controller for handling configuration settings such as root, depth, ruioEnabled, etc.
export interface ConfigLocalState {
  ruioEnabled: boolean
  depth: number
  currentColorPalette: string
  rootElementSelector?: string
}

const defaultConfig: ConfigLocalState = {
  ruioEnabled: RUIO_ENABLED,
  depth: UI_DEPTH,
  currentColorPalette: COLOR_PALETTE,
  rootElementSelector: ROOT_ELEMENT_SELECTOR,
}

export const getLocalStorageValue = (key: keyof ConfigLocalState) => {
  const storedValue = localStorage.getItem(key)
  return storedValue ? storedValue : defaultConfig[key]
}

export const getRuioEnabledLocalStorageValue = () => {
  const storedValue = getLocalStorageValue('ruioEnabled')
  return storedValue === 'true'
}

export const getRootSelectorLocalStorageValue = () => {
  const storedValue = getLocalStorageValue('rootElementSelector') as string
  return storedValue ?? ROOT_ELEMENT_SELECTOR
}

// helper function to append the proper selector identifier to the root element on root selection
export const parseSelectorFromSelectedElement = (selectedElement: HTMLElement) => {
  if (selectedElement.id) return `#${selectedElement.id}`
  if (selectedElement.className) return `.${selectedElement.className}`
  if (selectedElement.classList) return `.${selectedElement.classList[0]}`
  return ''
}

export const setLocalStorageValue = (key: keyof ConfigLocalState, value: string) => {
  localStorage.setItem(key, value)
}
