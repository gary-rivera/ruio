/**
 * color contrast utilities for dynamic palette generation
 * heavily based on WCAG contrast ratio guidelines from various sources (notated)
 * NOTE: so many magic numbers, please fix eventually
 */

const WHITE_RGB_FALLBACK = { r: 255, g: 255, b: 255 }
interface RGB {
  r: number
  g: number
  b: number
}

/**
 * if color is transparent, traverses up the DOM to find first non-transparent background
 */
export const getComputedBackgroundColor = (element: HTMLElement): RGB => {
  let current: HTMLElement | null = element

  while (current && current !== document.body) {
    const bgColor = window.getComputedStyle(current).backgroundColor
    const isNotTransparent = bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)'

    if (isNotTransparent) {
      // tl;dr - check for opacity
      const match = bgColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/)

      if (match) {
        const alpha = match[4] ? parseFloat(match[4]) : 1
        if (alpha > 0.1) {
          // Consider it visible if alpha > 0.1
          return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) }
        }
      }
    }

    current = current.parentElement
  }

  // Default to white if no background color found
  return WHITE_RGB_FALLBACK
}

/**
 * calculate relative luminance according to WCAG formula
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export const getRelativeLuminance = (rgb: RGB): number => {
  const { r, g, b } = rgb

  // Convert to 0-1 range
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = val / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Convert RGB to HSL
 * Based on algorithm from CSS Color Module Level 3 - https://www.w3.org/TR/css-color-3/#hsl-color
 */
const rgbToHsl = (rgb: RGB): { h: number; s: number; l: number } => {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / diff + 2) / 6
        break
      case b:
        h = ((r - g) / diff + 4) / 6
        break
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

/**
 * Generate a contrasting outline color for an element
 * Uses complementary colors based on parent's background for maximum contrast
 * Uses depth to ensure color variation between nested elements
 */
export const generateContrastingColor = (element: HTMLElement, depth: number): string => {
  const elementBg = getComputedBackgroundColor(element)
  const parentBg = element.parentElement
    ? getComputedBackgroundColor(element.parentElement)
    : { r: 255, g: 255, b: 255 }

  const elementLum = getRelativeLuminance(elementBg)
  const parentLum = getRelativeLuminance(parentBg)

  // how we determine what color variance to use
  const avgLum = (elementLum + parentLum) / 2

  // light backgrounds -> use vibrant neon colors
  if (avgLum > 0.5) {
    const baseHue = (depth * 51) % 360

    const saturation = 95 + Math.floor((depth % 2) * 5)
    const lightness = 45 + Math.floor((depth % 4) * 5)

    return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`
  }
  // dark backgrounds -> use complementary colors
  else {
    const parentHsl = rgbToHsl(parentBg)

    // Calculate complementary color (opposite on color wheel)
    let complementaryHue = (parentHsl.h + 180) % 360

    const depthOffset = (depth * 45) % 135
    complementaryHue = (complementaryHue + depthOffset - 67.5) % 360

    const saturation = 95 + Math.floor((depth % 2) * 5)
    const lightness = 60 + Math.floor((depth % 4) * 8)

    return `hsl(${Math.floor(complementaryHue)}, ${saturation}%, ${lightness}%)`
  }
}
