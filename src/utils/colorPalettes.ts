export const colorPalettesMap: Record<string, string[]> = {
  default: [
    '#249EA0', // Blue
    '#FAAB36', // Orange
    '#008083', // Cerulean
    '#F78104', // Lime Orange
    '#005F60', // Ruio Cyan
    '#FD5901', // Blood Orange
  ],
  roygbiv: [
    '#CD001A', // Red
    '#EF6A00', // Orange
    '#F2CD00', // Yellow
    '#79C300', // Green
    '#1961AE', // Blue
    '#61007D', // Violet
  ],
  neon: [
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFFF00', // Yellow
    '#00FF00', // Bright Green
    '#FF5F00', // Neon Orange
    '#1E90FF', // Neon Blue
  ],
  minima: [
    '#2F3E46', // Charcoal Gray
    '#CAD2C5', // Pale Green
    '#4A4E69', // Muted Purple
    '#F4F1DE', // Soft Beige
    '#555B6E', // Slate Blue
    '#EAF8EF', // Soft Terracotta
  ],
}

export const getRelativeDepthColor = (colors: string[], currentDepth: number): string => {
  if (!colors.length) {
    throw new Error(`[ruio][utils/colorPalettes] no colors found for the current theme`)
  }
  const index = currentDepth % colors.length
  return colors[index]
}
