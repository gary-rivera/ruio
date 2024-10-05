import React, { useState, useRef, useEffect } from 'react'
import { colorPalettesMap } from '@utils/colorPalettes'
import { useRuioContext } from '@context/RuioContextProvider'
import ChevronIcon from '@components/icons/ChevronIcon'

import styles from '../../styles/ColorPaletteDropdown.module.css'
import buttonStyles from '../../styles/Button.module.css'
import spanStyles from '../../styles/Span.module.css'
import divStyles from '../../styles/Div.module.css'

type ColorPaletteDropdownProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function ColorPaletteDropdown({ isOpen, setIsOpen }: ColorPaletteDropdownProps) {
  const { currentColorPalette, setCurrentColorPalette } = useRuioContext()
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const handleOpenDropdown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isOpen) setIsOpen(true)
  }
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

  const handleDropdownItemHover = (event: React.MouseEvent<HTMLDivElement>) => {}

  useEffect(() => {}, [isOpen, dropdownRef])

  return (
    <div className={styles.colorPaletteDropdownControl} ref={dropdownRef}>
      {currentColorPalette}

      <div
        className={`${styles.dropdownMenu} ${isOpen ? styles.dropdownMenuOpen : ''}`}
        ref={dropdownRef}
        onMouseLeave={handleMouseLeave}
      >
        {Object.entries(colorPalettesMap).map(([paletteKey, colors]) => {
          const itemIsCurrentTheme = paletteKey === currentColorPalette
          return (
            <div
              key={paletteKey}
              data-palette-key={paletteKey} // for state updates :)
              className={`${itemIsCurrentTheme ? divStyles['ruio-dropdown-list-item-active-theme'] : ''} ${divStyles['ruio-dropdown-list-item']}`}
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                fontWeight: '200',
                fontSize: '0.75rem',
                padding: '0.7rem 0rem',
              }}
              onClick={handleThemeSelect}
            >
              <div
                className="selected-icon"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '25%',
                }}
              >
                {/* TODO: add an svg */}
                {itemIsCurrentTheme && 'x'}
              </div>
              <div
                className="color-display-item"
                style={{
                  width: '75%',
                }}
              >
                <div
                  className="ruio-theme-title"
                  style={{
                    marginBottom: '0.3rem',
                  }}
                >
                  {paletteKey}
                </div>
                <ul
                  className="color-palette"
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    padding: 0,
                    height: '0.55rem',
                    width: '80%',
                    margin: 0,
                    borderRadius: '50px',
                    // overflow: 'hidden',
                  }}
                >
                  {colors.map((color) => (
                    <li key={color} style={{ flex: 1, backgroundColor: color }} />
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ColorPaletteDropdown
