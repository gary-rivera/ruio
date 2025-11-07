import React, { useRef, useState, useEffect } from 'react'
import { colorPalettesMap } from '@utils/colorPalettes'
import { useRuioContext } from '@context/RuioContextProvider'
import CheckmarkIcon from '@components/icons/CheckmarkIcon'
import styles from './ColorPaletteDropdown.module.css'

type ColorPaletteDropdownProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function ColorPaletteDropdown({ isOpen, setIsOpen }: ColorPaletteDropdownProps) {
  const { currentColorPalette, setCurrentColorPalette } = useRuioContext()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const handleThemeSelect = (event: React.MouseEvent<HTMLDivElement>) => {
    const paletteKey = event.currentTarget.getAttribute('data-palette-key')
    if (paletteKey) setCurrentColorPalette(paletteKey)
  }

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    const movedToElement = event.relatedTarget as Node
    if (dropdownRef.current && !dropdownRef.current.contains(movedToElement)) {
      setTimeout(() => {
        setIsOpen(false)
      }, 350)
    }
  }

  useEffect(() => {
    if (!hoveredIndex) {
      const colorPaletteKeys = Object.keys(colorPalettesMap)
      setHoveredIndex(colorPaletteKeys.indexOf(currentColorPalette))
    }
  }, [])

  return (
    <div className={styles.control} ref={dropdownRef}>
      {currentColorPalette}

      <div
        className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}
        ref={dropdownRef}
        // onMouseLeave={handleMouseLeave}
      >
        {Object.entries(colorPalettesMap).map(([paletteKey, colors], index) => {
          const itemIsCurrentTheme = paletteKey === currentColorPalette

          return (
            <div
              key={paletteKey}
              data-palette-key={paletteKey}
              className={`
                ${styles.itemContainer}
                ${index === hoveredIndex ? styles.itemActive : ''}
              `}
              onClick={handleThemeSelect}
              onMouseEnter={() => setHoveredIndex(index)} // Set hovered index on mouse enter
            >
              <div className={styles.itemIcon}>{itemIsCurrentTheme && <CheckmarkIcon />}</div>
              <div className={styles.itemDetails}>
                <div className={styles.itemTitle}>{paletteKey}</div>
                {paletteKey === 'dynamic' ? (
                  <div className={styles.itemDescription}>
                    Auto-calculated based on element colors
                  </div>
                ) : (
                  <ul className={styles.itemColorPalette}>
                    {colors.map((color) => (
                      <li
                        key={color}
                        className={styles.itemColorSwatch}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ColorPaletteDropdown
