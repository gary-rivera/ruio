export const colorPalettesMap: Record<string, string[]> = {
  default: [
    '#249EA0', // Blue
    '#FAAB36', // Orange
    '#008083', // Cerulean
    '#F78104', // Lime Orange
    '#005F60', // Ruio Cyan
    '#FD5901', // Blood Orange
  ],
  // light: [
  //   '#FFCCCC', // Light Red
  //   '#CCE5FF', // Light Blue
  //   '#CCFFCC', // Light Green
  //   '#FFF5CC', // Light Yellow
  //   '#FFCCE5', // Light Pink
  //   '#CCFFF5', // Light Teal
  // ],
  // dark: [
  //   '#990000', // Dark Red
  //   '#003366', // Dark Blue
  //   '#006600', // Dark Green
  //   '#996600', // Dark Yellow/Brown
  //   '#660033', // Dark Pink
  //   '#003333', // Dark Teal
  // ],
  // didnt realize the negative connotation ._.
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
  minimal: [
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
