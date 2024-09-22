import React, { forwardRef } from 'react'
import RuioToggleController from '../controllers/RuioToggleController'

import divStyles from '@styles/Div.module.css'
import SettingsIcon from '@assets/SettingsIcon'
import ToggleElementSelectionModeIcon from '@assets/ToggleElementSelectionModeIcon'

interface RuioUIContainerProps {
  // NOTE: define as needed
}

function RuioUIContainer(props: RuioUIContainerProps, ref: React.Ref<HTMLDivElement>) {
  // TODO: delete once depth controlled by settings modal is built out
  // basically just ensures that the borders are applied to the root element on initial load to the starting point
  // useEffect(() => {
  //   const rootElement = document.querySelector('#root')

  //   if (rootElement) applyOutlineUI(rootElement as HTMLElement, depth, ruioEnabled)
  // }, [ruioEnabled, depth])

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
      {ruioEnabled && (
        <div className="ruio-exclude ruio-icons-container">
          <SettingsIcon />
          <ToggleElementSelectionModeIcon />
        </div>
      )}
    </div>
  )
}

export default forwardRef<HTMLDivElement, RuioUIContainerProps>(RuioUIContainer)
