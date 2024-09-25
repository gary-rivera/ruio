// components
import React from 'react'
import RuioWrapper from '../dist/ruio.esm'
import ParentComponent from '@components/dummy/ParentComponent'

// styles
import '@styles/globals.css'

const App: React.FC = () => {
  return (
    <div>
      <RuioWrapper>
        <div>
          <h1></h1>
        </div>
      </RuioWrapper>
    </div>
  )
}

export default App
