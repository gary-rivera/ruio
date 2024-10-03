import React, { useState, useRef, useEffect } from 'react'
import ColorPaletteOption from './ColorPaletteOption'
import { colorPalettesMap } from '@utils/colorPalettes'
import { useRuioContext } from '@context/RuioContextProvider'

// import './ColorPaletteDropdown.css' // Import your CSS styles
import buttonStyles from '../../styles/Button.module.css'
import spanStyles from '../../styles/Span.module.css'
import divStyles from '../../styles/Div.module.css'

function ColorPaletteDropdown(/*{ onSelect }*/) {
  const { currentColorPalette, setCurrentColorPalette } = useRuioContext()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPalette, setSelectedPalette] = useState('default')
  const dropdownRef = useRef()

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  // TODO: if hovered over 100ms render the dropdowncontainer (call handleToggle)
  // TODO: handleClick of item to establish new theme
  // TODO: handleClick outside of dropdown

  // const handleSelect = (paletteKey) => {
  //   setSelectedPalette(paletteKey)
  //   setIsOpen(false)
  //   if (onSelect) {
  //     onSelect(paletteKey)
  //   }
  // }

  // const handleClickOutside = (event) => {
  //   if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //     setIsOpen(false)
  //   }
  // }

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside)
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  // }, [])

  return (
    <div
      className="color-palette-dropdown-control"
      onClick={handleToggle}

      /*ref={dropdownRef}*/
    >
      <span>{currentColorPalette}</span>
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
        >
          {Object.entries(colorPalettesMap).map(([paletteKey, colors]) => {
            const isCurrentTheme = paletteKey === currentColorPalette
            return (
              <div
                key={paletteKey}
                className={`${isCurrentTheme && divStyles['ruio-dropdown-list-item-active-theme']} ${divStyles['ruio-dropdown-list-item']}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  fontWeight: '200',
                  fontSize: '0.75rem',
                  padding: '0.7rem 0rem',
                }}
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
                  {isCurrentTheme && 'x'}
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
