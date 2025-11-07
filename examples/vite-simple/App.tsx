import React from 'react'
import RuioWrapper from '../../src/components/RuioWrapper'
import Welcome from './components/Welcome'

const App: React.FC = () => {
  return (
    <RuioWrapper>
      <div
        style={{ fontFamily: 'Inter', minHeight: '100vh', background: '#f9fafb', paddingTop: '2rem' }}
      >
        <Welcome />
      </div>
    </RuioWrapper>
  )
}

export default App
