import React from 'react'
import UtilityIcon from './components/UtilityIcon'
import ControlPanel from './components/ControlPanel'
import ParentComponent from '@components/dummy/ParentComponent'
import '@styles/globals.css'

const App: React.FC = () => {
  return (
    <>
      <UtilityIcon />
      <ControlPanel />
      <ParentComponent />
      {/* Your main app components */}
    </>
  )
}

export default App
