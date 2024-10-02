import React, { useState, useRef, useEffect } from 'react'
import ColorPaletteOption from './ColorPaletteOption'
import { colorPalettesMap } from '@utils/colorPalettes'
import { useRuioContext } from '@context/RuioContextProvider'

// import './ColorPaletteDropdown.css' // Import your CSS styles
import buttonStyles from '../../styles/Button.module.css'
import spanStyles from '../../styles/Span.module.css'

function ColorPaletteDropdown(/*{ onSelect }*/) {
  const { currentColorPalette } = useRuioContext()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPalette, setSelectedPalette] = useState('default')
  const dropdownRef = useRef()

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }
  // TODO: if hovered over 100ms render the dropdowncontainer (call handleToggle)
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
      style={{ display: 'flex', position: 'relative' }} /*ref={dropdownRef}*/
    >
      <button
        className={buttonStyles['ruio-btn']}
        onClick={handleToggle}
        style={{ color: '#FFFFFF', backgroundColor: 'transparent' }}
      >
        {/* <ColorPaletteOption palette={selectedPalette} colors={colorPalettesMap[selectedPalette]} /> */}
        {currentColorPalette}
      </button>
      {isOpen && (
        <div
          className="dropdown-menu"
          style={{
            width: '150px',
            backgroundColor: 'blue',
            position: 'absolute',
            top: '110%' /* Positions the dropdown below the toggle */,
            right: '-20px',
          }}
        >
          {Object.entries(colorPalettesMap).map(([paletteKey, colors]) => (
            <div style={{ backgroundColor: 'white', width: '125px', height: '25px', color: 'black' }}>
              {paletteKey}
            </div>
            // <div
            //   key={paletteKey}
            //   className="dropdown-item"
            //   onClick={
            //     () => console.log('color palette option clicked')
            //     handleSelect(paletteKey)
            //   }
            // >
            //   <ColorPaletteOption palette={paletteKey} colors={colors} />
            // </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ColorPaletteDropdown
