import React, { forwardRef, useState, useEffect } from 'react'
import RuioToggleController from '../controllers/RuioToggleController'

import SettingsIcon from '@components/icons/SettingsIcon'
import ElementSelectIcon from '@components/icons/ElementSelectIcon'
import SettingsModal from './settings/SettingsModal'

import '../styles/globals.css'
import divStyles from '../styles/Div.module.css'
import iconStyles from '../styles/Icon.module.css'

type ControllersContainerState = {
  elementSelectOpen: boolean
  settingsOpen: boolean
  toggleControllerOpen: boolean
}

function RuioUIContainer(_: unknown, ref: React.Ref<HTMLDivElement>) {
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
      [key]: !prevState[key],
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
        <div className={iconStyles['icon-container']}>
          <SettingsIcon onClick={() => toggleContainer('settingsOpen')} />
          <SettingsModal isOpen={isOpen.settingsOpen} onClose={() => toggleContainer('settingsOpen')} />
        </div>
        <div className={iconStyles['icon-container']}>
          <ElementSelectIcon onClick={() => toggleContainer('elementSelectOpen')} />
          {/* NOTE: for adding on the spot depth controls */}
          {isOpen.elementSelectOpen && false && <div>{/* Render Element Select Container */}</div>}
        </div>
      </div>
      <RuioToggleController />
    </div>
  )
}

export default forwardRef<HTMLDivElement>(RuioUIContainer)
