import React, { forwardRef, useState } from 'react'
import RuioToggleController from '../controllers/RuioToggleController'

import SettingsIcon from '@components/icons/SettingsIcon'
import ElementSelectIcon from '@components/icons/ElementSelectIcon'
import SettingsModal from './settings/SettingsModal'

import '../styles/globals.css'
import divStyles from '../styles/Div.module.css'
import iconStyles from '../styles/Icon.module.css'
import { useRuioContext } from '@root/context/RuioContextProvider'

type UIPanelVisibility = { elementSelector: boolean; settingsModal: boolean }

function RuioUIContainer(_: unknown, ref: React.Ref<HTMLDivElement>) {
  const { ruioEnabled, isElementSelectionModeActive, setIsElementSelectionModeActive } = useRuioContext()

  const [panelVisibility, setPanelVisibility] = useState<UIPanelVisibility>({
    elementSelector: false,
    settingsModal: false,
  })

  const togglePanel = (panel: keyof UIPanelVisibility) => {
    setPanelVisibility((prev) => {
      const newState = {
        elementSelector: false,
        settingsModal: false,
        [panel]: !prev[panel],
      }
      return newState
    })

    // ensure element selection deactivated when opening settings
    if (panel === 'settingsModal' && !panelVisibility.settingsModal) {
      setIsElementSelectionModeActive(false)
    }
  }

  const getIconStateClass = (icon: 'settings' | 'elementSelector') => {
    const baseClass = iconStyles['icon-container']

    const thisIconIsActive =
      icon === 'settings' ? panelVisibility.settingsModal : isElementSelectionModeActive

    const otherIconIsActive =
      icon === 'settings' ? isElementSelectionModeActive : panelVisibility.settingsModal

    if (thisIconIsActive) return `${baseClass} ${iconStyles['icon-active']}`
    if (otherIconIsActive) return `${baseClass} ${iconStyles['icon-dimmed']}`

    return baseClass
  }

  return (
    <div
      ref={ref}
      data-testid="ruio-ui-container"
      className={`ruio-exclude ${divStyles['ruio-ui-container']}`}
      id="ruio-exclude"
    >
      <div id="ruio-controls-container">
        <div id="ruio-settings-container" className={getIconStateClass('settings')}>
          <SettingsIcon onClick={() => togglePanel('settingsModal')} />
          {ruioEnabled && (
            <SettingsModal
              isOpen={panelVisibility.settingsModal}
              onClose={() => togglePanel('settingsModal')}
            />
          )}
        </div>

        <div id="ruio-element-select-container" className={getIconStateClass('elementSelector')}>
          <ElementSelectIcon onClick={() => togglePanel('elementSelector')} />
          {/* TODO: Add inline depth controls panel */}
          {panelVisibility.elementSelector && false && <div>{/* Element selector panel content */}</div>}
        </div>
      </div>

      <RuioToggleController isDimmed={isElementSelectionModeActive || panelVisibility.settingsModal} />
    </div>
  )
}

export default forwardRef<HTMLDivElement>(RuioUIContainer)
