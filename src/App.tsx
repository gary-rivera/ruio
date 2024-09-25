// components
import React from 'react'
import RuioWrapper from '@components/RuioWrapper'
import ParentComponent from '@components/dummy/ParentComponent'

const App: React.FC = () => {
  return (
    <RuioWrapper>
      <ParentComponent />
      <ParentComponent />
    </RuioWrapper>
  )
}

export default App
