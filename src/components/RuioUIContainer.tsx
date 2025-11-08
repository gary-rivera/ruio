import React, { forwardRef, useState } from 'react'
import RuioToggleController from '@controllers/RuioToggleController'
import SettingsIcon from '@components/icons/SettingsIcon'
import ElementSelectIcon from '@components/icons/ElementSelectIcon'
import SettingsModal from '@components/settings/SettingsModal'
import { ElementSelectionTooltip } from '@components/ElementSelectionTooltip'
import { PersistedElementTooltip } from '@components/PersistedElementTooltip'
import { useRuioContext } from '@root/context/RuioContextProvider'

import styles from '@components/RuioUIContainer.module.css'

type UIPanelVisibility = { elementSelector: boolean; settingsModal: boolean }

function RuioUIContainer(_: unknown, ref: React.Ref<HTMLDivElement>) {
  const {
    ruioEnabled,
    isElementSelectionModeActive,
    setIsElementSelectionModeActive,
    tooltipData,
    persistedTooltipData,
    rootElement,
  } = useRuioContext()

  const [panelVisibility, setPanelVisibility] = useState<UIPanelVisibility>({
    elementSelector: false,
    settingsModal: false,
  })

  const exclusivelyTogglePanel = (panel: keyof UIPanelVisibility) => {
    setPanelVisibility((prev) => {
      const newState = { elementSelector: false, settingsModal: false, [panel]: !prev[panel] }
      return newState
    })

    // ensure element selection deactivated when opening settings
    if (panel === 'settingsModal' && !panelVisibility.settingsModal) {
      setIsElementSelectionModeActive(false)
    }
  }

  const getIconStateClass = (icon: 'settings' | 'elementSelector') => {
    const baseClass = styles.iconContainer

    const thisIconIsActive =
      icon === 'settings' ? panelVisibility.settingsModal : isElementSelectionModeActive

    const otherIconIsActive =
      icon === 'settings' ? isElementSelectionModeActive : panelVisibility.settingsModal

    if (thisIconIsActive) return `${baseClass} ${styles.iconActive}`
    if (otherIconIsActive) return `${baseClass} ${styles.iconDimmed}`

    return baseClass
  }

  return (
    <div
      ref={ref}
      data-testid="ruio-ui-container"
      className={`ruio-exclude ${styles.container}`}
      id="ruio-exclude"
    >
      <div id="ruio-controls-container">
        <div id="ruio-settings-container" className={getIconStateClass('settings')}>
          <SettingsIcon onClick={() => exclusivelyTogglePanel('settingsModal')} />
          {ruioEnabled && (
            <SettingsModal
              isOpen={panelVisibility.settingsModal}
              onClose={() => exclusivelyTogglePanel('settingsModal')}
            />
          )}
        </div>

        <div id="ruio-element-select-container" className={getIconStateClass('elementSelector')}>
          <ElementSelectIcon onClick={() => exclusivelyTogglePanel('elementSelector')} />
        </div>
      </div>

      <RuioToggleController isDimmed={isElementSelectionModeActive || panelVisibility.settingsModal} />

      {isElementSelectionModeActive && <ElementSelectionTooltip data={tooltipData} />}
      {!isElementSelectionModeActive && ruioEnabled && (
        <PersistedElementTooltip data={persistedTooltipData} rootElement={rootElement} />
      )}
    </div>
  )
}

export default forwardRef<HTMLDivElement>(RuioUIContainer)
