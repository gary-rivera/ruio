import React, { forwardRef, useState, useEffect } from 'react'
import RuioToggleController from '../controllers/RuioToggleController'

import SettingsIcon from '@components/icons/SettingsIcon'
import ElementSelectIcon from '@components/icons/ElementSelectIcon'
import SettingsModal from './settings/SettingsModal'

import '../styles/globals.css'
import divStyles from '../styles/Div.module.css'
import iconStyles from '../styles/Icon.module.css'

interface RuioUIContainerProps {
  // NOTE: define as needed
}
type ControllersContainerState = {
  elementSelectOpen: boolean
  settingsOpen: boolean
  toggleControllerOpen: boolean
}

function RuioUIContainer(props: RuioUIContainerProps, ref: React.Ref<HTMLDivElement>) {
  const [isOpen, setIsOpen] = useState<ControllersContainerState>({
    elementSelectOpen: false,
    settingsOpen: false,
    toggleControllerOpen: false,
  })

  const toggleContainer = (key: keyof ControllersContainerState) => {
    setIsOpen((prevState) => ({
      elementSelectOpen: false,
      settingsOpen: false,
      toggleControllerOpen: false,
      [key]: !prevState[key], // Toggle only the selected container
    }))
  }
  return (
    <div
      ref={ref}
      data-testid="ruio-ui-container"
      className={`
        ruio-exclude
        ${divStyles['ruio-ui-container']}
      `}
    >
      <div className="ruio-controls-container">
        <div className={iconStyles['icon-container']} style={{ border: '1px solid red' }}>
          <SettingsIcon
            onClick={() => {
              console.log('settings clicked')
              toggleContainer('settingsOpen')
            }}
          />
          {isOpen.settingsOpen && (
            <SettingsModal
              // settingsModalClassName={iconStyles['dropdown']}
              isOpen={isOpen.settingsOpen}
              onClose={() => toggleContainer('settingsOpen')}
            />
          )}
        </div>
        <div className={iconStyles['icon-container']}>
          <ElementSelectIcon onClick={() => toggleContainer('elementSelectOpen')} />
          {isOpen.elementSelectOpen && (
            <div className={iconStyles['dropdown']}>{/* Render Element Select Container */}</div>
          )}
        </div>
      </div>
      <RuioToggleController />
    </div>
  )
}

export default forwardRef<HTMLDivElement, RuioUIContainerProps>(RuioUIContainer)
