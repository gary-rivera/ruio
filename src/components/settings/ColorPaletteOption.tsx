type ColorPaletteOptionProps = {
  palette: string
  colors: string[]
}
function ColorPaletteOption({ palette, colors }: ColorPaletteOptionProps) {
  return (
    <div className="color-palette-option">
      <span className="palette-name">{palette}</span>
      <div className="color-swatches">
        {colors.map((color, index) => (
          <div key={index} className="swatch" style={{ backgroundColor: color }} />
        ))}
      </div>
    </div>
  )
}

export default ColorPaletteOption
