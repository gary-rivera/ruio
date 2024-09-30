const colorPalettes: Record<string, string[]> = {
  default: [
    '#ff5832', // Vivid Orange
    '#84a5ad', // Muted Cyan
    '#c17f70', // Soft Brown
    '#5bbfd6', // Bright Cyan
    '#ea6547', // Warm Red-Orange
    '#999999', // Neutral Gray
    '#ad8c84', // Muted Pink
    '#70b2c1', // Light Cyan
    '#d6725b', // Warm Coral
    '#47ccea', // Bright Aqua
  ],
  light: [
    '#FFCCCC', // Light Red
    '#CCE5FF', // Light Blue
    '#CCFFCC', // Light Green
    '#FFF5CC', // Light Yellow
    '#FFCCE5', // Light Pink
    '#CCFFF5', // Light Teal
    '#FFE5CC', // Light Orange
    '#E5CCFF', // Light Purple
    '#FFF0CC', // Light Peach
    '#CCFFEA', // Light Aqua
  ],
  dark: [
    '#990000', // Dark Red
    '#003366', // Dark Blue
    '#006600', // Dark Green
    '#996600', // Dark Yellow/Brown
    '#660033', // Dark Pink
    '#003333', // Dark Teal
    '#994C00', // Dark Orange
    '#330066', // Dark Purple
    '#664400', // Dark Peach/Brown
    '#00664C', // Dark Aqua
  ],
  // didnt realize the negative connotation ._.
  roygbiv: [
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#8B00FF', // Violet
  ],
  neon: [
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFFF00', // Yellow
    '#00FF00', // Bright Green
    '#FF0000', // Bright Red
    '#0000FF', // Bright Blue
    '#FF7F00', // Bright Orange
    // NOTE: pastel pink #FFADAD, pastel peach #FFD6A5, pastel yellow #FDFFB6, pastel green #CAFFBF, pastel blue #9BF6FF, pastel purple #A0C4FF
  ],
  minimalist: [
    '#FFFFFF', // Pure White
    '#000000', // Pure Black
    '#F5F5F5', // White Smoke
    '#1C1C1C', // Very Dark Gray
    '#E5E5E5', // Light Gray
    '#2B2B2B', // Charcoal Black
    '#D3D3D3', // Light Gray (Silver)
    '#4F4F4F', // Dark Gray
    '#FAFAFA', // Very Light White
    '#333333', // Darker Gray
  ],
}

export const getRelativeDepthColor = (theme: keyof typeof colorPalettes, depth: number): string => {
  const palette = colorPalettes[theme]
  if (!palette.length) {
    throw new Error(`The theme '${theme}' does not have any colors defined.`)
  }
  return palette[depth % palette.length]
}
