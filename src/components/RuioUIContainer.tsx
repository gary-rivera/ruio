import React, { forwardRef, useRef, useEffect } from 'react'
import { useRuioContext } from '@context/RuioContextProvider'
// import { applyOutlineUI } from '@utils/applyOutlineUI'
import RuioToggleController from '../controllers/RuioToggleController'

import '@styles/RuioUIContainer.css'
import divStyles from '@styles/Div.module.css'
import SettingsIcon from '@assets/SettingsIcon'
import ToggleElementSelectionModeIcon from '@assets/ToggleElementSelectionModeIcon'

interface RuioUIContainerProps {
  // Define any props if needed, or leave empty
}
// TODO: rename to RuioUIContainer
function RuioUIContainer(props: RuioUIContainerProps, ref: React.Ref<HTMLDivElement>) {
  const { depth, setDepth, ruioEnabled, setRuioEnabled, toggleElementSelectionMode } = useRuioContext()

  // Icons to render:
  // // TODO: onclick trigger the settingsModal function to control theme, depth, etc
  // TODO: FAQ (question mark)
  // // TODO: opens a modal with brief FAQ and link to github for more info/usage

  // basically just ensures that the borders are applied to the root element on initial load to the starting point
  // useEffect(() => {
  //   const rootElement = document.querySelector('#root')

  //   if (rootElement) applyOutlineUI(rootElement as HTMLElement, depth, ruioEnabled)
  // }, [ruioEnabled, depth])

  return (
    <div ref={ref} data-testid="ruio-control-panel" className="ruio-exclude ruio-control-panel ">
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
