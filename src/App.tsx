// components
import React from 'react'
import UtilityIcon from './components/UtilityIcon'
import { RuioProvider } from '@context/RuioContext'
import ControlPanel from './components/ControlPanel'
import ParentComponent from '@components/dummy/ParentComponent'

// styles
import '@styles/globals.css'

const App: React.FC = () => {
  return (
    <RuioProvider>
      <div>
        {/* TODO: add container for these two and only render control panel when util icon is in active state */}
        <UtilityIcon />
        <ControlPanel />
        <ParentComponent />
      </div>
    </RuioProvider>
  )
}

export default App
