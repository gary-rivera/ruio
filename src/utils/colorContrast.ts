/**
 * Color contrast utilities for dynamic palette generation
 * Based on WCAG contrast ratio guidelines
 */

interface RGB {
  r: number
  g: number
  b: number
}

/**
 * Parse a CSS color string to RGB values
 * Supports rgb(), rgba(), hex, and named colors
 */
export const parseColor = (color: string): RGB => {
  // Create a temporary element to let the browser parse the color
  const temp = document.createElement('div')
  temp.style.color = color
  document.body.appendChild(temp)
  const computed = window.getComputedStyle(temp).color
  document.body.removeChild(temp)

  // Parse rgb() or rgba() format
  const match = computed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (match) {
    return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) }
  }

  // Fallback to white if parsing fails
  return { r: 255, g: 255, b: 255 }
}

/**
 * Get computed background color of an element
 * If transparent, traverse up the DOM to find first non-transparent background
 */
export const getEffectiveBackgroundColor = (element: HTMLElement): RGB => {
  let current: HTMLElement | null = element

  while (current && current !== document.body) {
    const bgColor = window.getComputedStyle(current).backgroundColor

    // Check if color is not transparent
    if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
      // Check if it has some opacity
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
  return { r: 255, g: 255, b: 255 }
}

/**
 * Calculate relative luminance according to WCAG formula
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
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export const getContrastRatio = (color1: RGB, color2: RGB): number => {
  const lum1 = getRelativeLuminance(color1)
  const lum2 = getRelativeLuminance(color2)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.75) / (darker + 0.75)
}

/**
 * Convert RGB to HSL
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
  const elementBg = getEffectiveBackgroundColor(element)
  const parentBg = element.parentElement
    ? getEffectiveBackgroundColor(element.parentElement)
    : { r: 255, g: 255, b: 255 }

  // Calculate luminance to determine if backgrounds are light or dark
  const elementLum = getRelativeLuminance(elementBg)
  const parentLum = getRelativeLuminance(parentBg)

  // Determine the average luminance to decide on contrast color
  const avgLum = (elementLum + parentLum) / 2

  // For light backgrounds (>0.5 luminance), use vibrant neon colors
  // For dark backgrounds (<=0.5 luminance), use complementary colors for better contrast
  if (avgLum > 0.5) {
    // Light background - use pure vibrant neon colors
    // Cycle through color wheel based on depth for variety
    const baseHue = (depth * 51) % 360 // 51 degrees gives good color separation

    // Very high saturation and medium-high lightness for neon effect
    const saturation = 95 + Math.floor((depth % 2) * 5) // 95-100%
    const lightness = 45 + Math.floor((depth % 4) * 5) // 45-60% - vibrant but visible

    return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`
  } else {
    // Dark background - use complementary colors that are bright
    const parentHsl = rgbToHsl(parentBg)

    // Calculate complementary color (opposite on color wheel)
    let complementaryHue = (parentHsl.h + 180) % 360

    // Add depth-based variation (each depth gets offset)
    const depthOffset = (depth * 45) % 135 // Vary within ±67.5 degrees
    complementaryHue = (complementaryHue + depthOffset - 67.5) % 360

    // Very high saturation and high lightness for maximum brightness
    const saturation = 95 + Math.floor((depth % 2) * 5) // 95-100%
    const lightness = 60 + Math.floor((depth % 4) * 8) // 60-92% - very bright

    return `hsl(${Math.floor(complementaryHue)}, ${saturation}%, ${lightness}%)`
  }
}
