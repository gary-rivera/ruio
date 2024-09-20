import '@styles/RuioToggleController.css'
import RuioLogoIcon from '@assets/RuioLogoIcon'

import { useRuioContext } from '@root/context/RuioContextProvider'

import '@styles/ControlPanel.css'

function RuioToggleController() {
  const { ruioEnabled, setRuioEnabled } = useRuioContext()

  return (
    <div
      className="ruio-toggle-logo"
      onClick={() => {
        setRuioEnabled(!ruioEnabled)
      }}
    >
      {/* TODO: should this actually remain its own component? may be over complicating things */}
      <RuioLogoIcon />
    </div>
  )
}

export default RuioToggleController
