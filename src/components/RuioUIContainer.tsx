import React, { forwardRef, useState } from 'react'
import RuioToggleController from '../controllers/RuioToggleController'

import SettingsIcon from '@components/icons/SettingsIcon'
import ElementSelectIcon from '@components/icons/ElementSelectIcon'
import SettingsModal from './settings/SettingsModal'

import '../styles/globals.css'
import divStyles from '../styles/Div.module.css'
import iconStyles from '../styles/Icon.module.css'
import { useRuioContext } from '@root/context/RuioContextProvider'

type RuioModeControls = { elementSelectOpen: boolean; settingsModal: boolean }

function RuioUIContainer(_: unknown, ref: React.Ref<HTMLDivElement>) {
  const { ruioEnabled, isElementSelectionModeActive, setIsElementSelectionModeActive } = useRuioContext()
  const [isOpen, setIsOpen] = useState<RuioModeControls>({
    elementSelectOpen: false,
    settingsModal: false,
  })

  const toggleModeUI = (key: keyof RuioModeControls) => {
    setIsOpen((prevState) => ({
      elementSelectOpen: false,
      settingsModal: false,
      [key]: !prevState[key],
    }))
    // Turn off element selection mode when toggling to settings
    if (key === 'settingsModal') {
      setIsElementSelectionModeActive(false)
    }
  }

  const getIconContainerClass = (iconType: 'settings' | 'elementSelect') => {
    const baseClass = iconStyles['icon-container']
    const isElementSelectActive = isElementSelectionModeActive
    const isSettingsActive = isOpen.settingsModal

    const isActive = iconType === 'settings' ? isSettingsActive : isElementSelectActive
    const isOtherActive = iconType === 'settings' ? isElementSelectActive : isSettingsActive

    if (isActive) return `${baseClass} ${iconStyles['icon-active']}`
    if (isOtherActive) return `${baseClass} ${iconStyles['icon-dimmed']}`

    return baseClass
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
        <div id="ruio-settings-container" className={getIconContainerClass('settings')}>
          <SettingsIcon onClick={() => toggleModeUI('settingsModal')} />
          {ruioEnabled && (
            <SettingsModal isOpen={isOpen.settingsModal} onClose={() => toggleModeUI('settingsModal')} />
          )}
        </div>
        <div id="ruio-element-select-container" className={getIconContainerClass('elementSelect')}>
          <ElementSelectIcon onClick={() => toggleModeUI('elementSelectOpen')} />
          {/* NOTE: for adding on the spot depth controls */}
          {isOpen.elementSelectOpen && false && <div>{/* Render Element Select Container */}</div>}
        </div>
      </div>
      <RuioToggleController isDimmed={isElementSelectionModeActive || isOpen.settingsModal} />
    </div>
  )
}

export default forwardRef<HTMLDivElement>(RuioUIContainer)
