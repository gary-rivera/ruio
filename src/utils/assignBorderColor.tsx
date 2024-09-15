const colorPalettes: Record<string, string[]> = {
  default: [
    '#ff5832',
    '#84a5ad',
    '#c17f70',
    '#5bbfd6',
    '#ea6547',
    '#999999',
    '#ad8c84',
    '#70b2c1',
    '#d6725b',
    '#47ccea',
    '#999999',
    '#84a5ad',
    '#c17f70',
    '#5bbfd6',
    '#ea6547',
    '#999999',
    '#ad8c84',
    '#70b2c1',
    '#d6725b',
    '#47ccea',
    '#999999',
    '#84a5ad',
    '#c17f70',
    '#5bbfd6',
    '#ea6547',
    '#999999',
    '#ad8c84',
    '#70b2c1',
    '#d6725b',
    '#47ccea',
    '#999999',
    '#84a5ad',
    '#c17f70',
    '#5bbfd6',
    '#ea6547',
    '#999999',
    '#ad8c84',
    '#70b2c1',
    '#d6725b',
    '#47ccea',
  ],
  light: [],
  dark: [],
  zesty: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'],
  neon: ['#FF00FF', '#00FFFF', '#FFFF00', '#00FF00', '#FF0000', '#0000FF', '#FF7F00'],
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
