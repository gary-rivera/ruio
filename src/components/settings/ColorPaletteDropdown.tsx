import React, { useState, useRef, useEffect } from 'react'
import { colorPalettesMap } from '@utils/colorPalettes'
import { useRuioContext } from '@context/RuioContextProvider'

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

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
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
    <div
      className="color-palette-dropdown-control"
      ref={dropdownRef}
      // onClick={() => {
      //   setIsOpen(true)
      // }}
    >
      {currentColorPalette}

      {isOpen && (
        <div
          className="dropdown-menu"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '10rem',
            backgroundColor: '#383B3A',
            position: 'absolute',
            top: '125%',
            right: 0,
            padding: '0.5rem 0rem',
            borderRadius: '8px',
            overflowY: 'auto',
            gap: '0.2rem',
          }}
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
                onClick={handleClick}
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
                      overflow: 'hidden',
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
      )}
    </div>
  )
}

export default ColorPaletteDropdown
