import React, { forwardRef, useRef, useEffect } from 'react'
import { useRuioContext } from '@context/RuioContextProvider'
import { applyBorders } from '@utils/applyBorders'
import RuioToggleLogo from '@components/RuioToggleLogo'

import '@styles/ControlPanel.css'
import SettingsIcon from '@assets/SettingsIcon'
import ToggleElementSelectionModeIcon from '@assets/ToggleElementSelectionModeIcon'

interface ControlPanelProps {
  // Define any props if needed, or leave empty
}

function ControlPanel(props: ControlPanelProps, ref: React.Ref<HTMLDivElement>) {
  const { depth, setDepth, ruioEnabled, setRuioEnabled, toggleElementSelectionMode } = useRuioContext()
  // DONE: renders the toggle button
  // DONE: transaparent background of container
  // DONE: position fixed bottom right

  // Icons to render:
  // DONE: enable elemnt select mode
  // // TODO: onclick trigger the selectElementMode function
  // DONE: configure settings (theme, depth, etc)
  // // TODO: onclick trigger the settingsModal function to control theme, depth, etc
  // TODO: FAQ (question mark)
  // // TODO: opens a modal with brief FAQ and link to github for more info/usage

  // TODO: on initial load only render toggle button
  // TODO: on toggle button click, render the rest of the buttons

  // perhaps move to settingsModal related components
  const handleDepthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepth(parseInt(event.target.value, 10))
  }

  // basically just ensures that the borders are applied to the root element on initial load to the starting point
  useEffect(() => {
    const rootElement = document.querySelector('#root')

    if (rootElement) applyBorders(rootElement as HTMLElement, depth, ruioEnabled)
  }, [ruioEnabled, depth])

  return (
    <div ref={ref} data-testid="ruio-control-panel" className="ruio-control-panel" style={{}}>
      <label className="ruio-exclude" style={{ color: 'black' }}>
        Depth:
        <input
          className="ruio-exclude"
          type="number"
          value={depth}
          onChange={handleDepthChange}
          min="1"
          max="10"
        />
      </label>
      <div className="ruio-exclude">
        <button className="ruio-exclude" onClick={toggleElementSelectionMode} disabled={!ruioEnabled}>
          Select Element
        </button>
      </div>
      {ruioEnabled && <ToggleElementSelectionModeIcon />}
      {ruioEnabled && <SettingsIcon />}
      <RuioToggleLogo />
    </div>
  )
}

export default forwardRef<HTMLDivElement, ControlPanelProps>(ControlPanel)
