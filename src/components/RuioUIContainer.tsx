import React, { forwardRef, useEffect } from 'react'
import RuioToggleController from '../controllers/RuioToggleController'
import { applyOutlineUI } from '@utils/applyOutlineUI'
import { useRuioContext } from '@root/context/RuioContextProvider'

import divStyles from '@styles/Div.module.css'
import SettingsIcon from '@assets/SettingsIcon'
import ToggleElementSelectionModeIcon from '@assets/ToggleElementSelectionModeIcon'

interface RuioUIContainerProps {
  // NOTE: define as needed
}

function RuioUIContainer(props: RuioUIContainerProps, ref: React.Ref<HTMLDivElement>) {
  const { depth, ruioEnabled, parentAppRootElement, selectedRootElement } = useRuioContext()

  // TODO: delete once depth controlled by settings modal is built out
  // basically just ensures that the borders are applied to the root element on initial load to the starting point
  useEffect(() => {
    if (parentAppRootElement && selectedRootElement?.id !== parentAppRootElement.id)
      applyOutlineUI(selectedRootElement as HTMLElement, depth, ruioEnabled)
  }, [ruioEnabled, depth])

  return (
    <div
      ref={ref}
      data-testid="ruio-ui-container"
      className={`
        ruio exlcude
        ${divStyles['ruio-ui-container']}
      `}
    >
      {/* all ruio components are lazy-loaded, css controls respective render effects */}
      <RuioToggleController />
      <ToggleElementSelectionModeIcon />
      {/* <SettingsIcon /> */}
    </div>
  )
}

export default forwardRef<HTMLDivElement, RuioUIContainerProps>(RuioUIContainer)
