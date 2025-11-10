import React, { forwardRef, useState } from 'react'
import UIToggleController from '@controllers/UIToggleController'
import SettingsIcon from '@components/icons/SettingsIcon'
import ElementSelectIcon from '@components/icons/ElementSelectIcon'
import SettingsModal from '@components/settings/SettingsModal'
import { ElementPreviewTooltip } from '@components/tooltip/ElementPreviewTooltip'
import { ElementSelectedTooltip } from '@components/tooltip/ElementSelectedTooltip'
import { useRuioContext } from '@root/context/RuioContextProvider'

import styles from '@components/UIContainer.module.css'

type UIPanelVisibility = { elementPicker: boolean; settingsModal: boolean }

function UIContainer(_: unknown, ref: React.Ref<HTMLDivElement>) {
  const {
    ruioEnabled,
    isElementPickerActive,
    setIsElementPickerActive,
    tooltipData,
    persistedTooltipData,
    rootElement,
  } = useRuioContext()

  const [panelVisibility, setPanelVisibility] = useState<UIPanelVisibility>({
    elementPicker: false,
    settingsModal: false,
  })

  const exclusivelyTogglePanel = (panel: keyof UIPanelVisibility) => {
    setPanelVisibility((prev) => {
      const newState = { elementPicker: false, settingsModal: false, [panel]: !prev[panel] }
      return newState
    })

    // ensure element picker deactivated when opening settings
    if (panel === 'settingsModal' && !panelVisibility.settingsModal) {
      setIsElementPickerActive(false)
    }
  }

  const getIconStateClass = (icon: 'settings' | 'elementPicker') => {
    const baseClass = styles.iconContainer

    const thisIconIsActive =
      icon === 'settings' ? panelVisibility.settingsModal : isElementPickerActive

    const otherIconIsActive =
      icon === 'settings' ? isElementPickerActive : panelVisibility.settingsModal

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

        <div id="ruio-element-select-container" className={getIconStateClass('elementPicker')}>
          <ElementSelectIcon onClick={() => exclusivelyTogglePanel('elementPicker')} />
        </div>
      </div>

      <UIToggleController isDimmed={isElementPickerActive || panelVisibility.settingsModal} />

      {isElementPickerActive && <ElementPreviewTooltip data={tooltipData} />}
      {!isElementPickerActive && ruioEnabled && (
        <ElementSelectedTooltip data={persistedTooltipData} rootElement={rootElement} />
      )}
    </div>
  )
}

export default forwardRef<HTMLDivElement>(UIContainer)
