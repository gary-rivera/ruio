import React, { forwardRef, useState } from 'react'
import RuioToggleController from '../controllers/RuioToggleController'

import SettingsIcon from '@components/icons/SettingsIcon'
import ElementSelectIcon from '@components/icons/ElementSelectIcon'
import SettingsModal from './settings/SettingsModal'

import '../styles/globals.css'
import divStyles from '../styles/Div.module.css'
import iconStyles from '../styles/Icon.module.css'
import { useRuioContext } from '@root/context/RuioContextProvider'

type ControllersContainerState = {
  elementSelectOpen: boolean
  settingsOpen: boolean
}

function RuioUIContainer(_: unknown, ref: React.Ref<HTMLDivElement>) {
  const { ruioEnabled } = useRuioContext()
  const [isOpen, setIsOpen] = useState<ControllersContainerState>({
    elementSelectOpen: false,
    settingsOpen: false,
  })

  const toggleContainer = (key: keyof ControllersContainerState) => {
    setIsOpen((prevState) => ({
      elementSelectOpen: false,
      settingsOpen: false,
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
      id="ruio-exclude"
    >
      <div id="ruio-controls-container">
        <div id="ruio-settings-container" className={iconStyles['icon-container']}>
          <SettingsIcon onClick={() => toggleContainer('settingsOpen')} />
          {ruioEnabled && (
            <SettingsModal
              isOpen={isOpen.settingsOpen}
              onClose={() => toggleContainer('settingsOpen')}
            />
          )}
        </div>
        <div id="ruio-element-select-container" className={iconStyles['icon-container']}>
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
