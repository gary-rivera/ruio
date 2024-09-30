import { useState, useRef, useEffect, MouseEvent } from 'react'
import { useRuioContext } from '@root/context/RuioContextProvider'
import SettingsModal from '@components/SettingsModal'
import RuioIcon from './RuioIcon'

import buttonStyles from '../styles/Button.module.css'
import svgStyles from '../styles/SVG.module.css'

function SettingsIcon() {
  const { ruioEnabled } = useRuioContext()
  const [settingsModalEnabled, setSettingsModalEnabled] = useState(false)
  const [modalPosition, setModalPosition] = useState({ bottom: 0, right: 0 })
  const iconRef = useRef<HTMLDivElement>(null)

  function handleToggleSettings(event: MouseEvent<HTMLButtonElement>) {
    if (ruioEnabled) {
      if (!settingsModalEnabled && iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect()
        const offsetBottom = 20 // Adjust this value for desired spacing from the bottom
        const offsetRight = 20 // Adjust this value for desired spacing from the right

        console.log('innerHeight: ', window.innerHeight)
        console.log('rect.bottom: ', rect.bottom)
        console.log('rect.right: ', rect.right)

        setModalPosition({
          bottom: window.innerHeight - rect.bottom + offsetBottom, // Calculating distance from the bottom of the icon
          right: window.innerWidth - rect.right + offsetRight, // Calculating distance from the right of the icon
        })
      }
      setSettingsModalEnabled(!settingsModalEnabled)
    }
  }

  return (
    <div
      ref={iconRef}
      style={{
        outline: '2px solid pink',
        margin: '5px',
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'end',
        position: 'relative',
      }}
    >
      <RuioIcon
        onClick={handleToggleSettings}
        buttonClassName={`
          ruio-exclude
          ${buttonStyles['ruio-btn']}
          ${buttonStyles['ruio-btn-secondary']}
          ${ruioEnabled ? buttonStyles['ruio-settings-btn-active'] : buttonStyles['ruio-settings-btn-inactive']}
        `}
        svgClassName={`${svgStyles['ruio-svg']} ${svgStyles['ruio-settings-svg']}`}
      >
        <>
          {/* The SVG paths remain unchanged */}
          <path
            className={`${svgStyles['ruio-outline']}`}
            d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className={`${svgStyles['ruio-bar-bg']}`}
            d="M15.5699 18.5001V14.6001"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className={`${svgStyles['ruio-bar-bg']}`}
            d="M15.5699 7.45V5.5"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className={`${svgStyles['ruio-dial']}`}
            d="M15.57 12.65C17.0059 12.65 18.17 11.4859 18.17 10.05C18.17 8.61401 17.0059 7.44995 15.57 7.44995C14.134 7.44995 12.97 8.61401 12.97 10.05C12.97 11.4859 14.134 12.65 15.57 12.65Z"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className={`${svgStyles['ruio-bar-bg']}`}
            d="M8.43005 18.5V16.55"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className={`${svgStyles['ruio-bar-bg']}`}
            d="M8.43005 9.4V5.5"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className={`${svgStyles['ruio-dial']}`}
            d="M8.42996 16.5501C9.8659 16.5501 11.03 15.386 11.03 13.9501C11.03 12.5142 9.8659 11.3501 8.42996 11.3501C6.99402 11.3501 5.82996 12.5142 5.82996 13.9501C5.82996 15.386 6.99402 16.5501 8.42996 16.5501Z"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      </RuioIcon>
      {settingsModalEnabled && (
        <SettingsModal
          isOpen={settingsModalEnabled}
          position={modalPosition}
          onClose={() => setSettingsModalEnabled(false)}
        />
      )}
    </div>
  )
}

export default SettingsIcon
