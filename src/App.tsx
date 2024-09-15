// components
import React from 'react'
import RuioWrapper from '@components/RuioWrapper'
import ParentComponent from '@components/dummy/ParentComponent'

// styles
import '@styles/globals.css'

const App: React.FC = () => {
  return (
    <RuioWrapper>
      <ParentComponent />
    </RuioWrapper>
  )
}

export default App
