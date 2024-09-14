import React, { createContext, useState, ReactNode } from 'react'

interface BorderDebuggerContextProps {
  bordersEnabled: boolean
  setBordersEnabled: React.Dispatch<React.SetStateAction<boolean>>
  depth: number
  setDepth: React.Dispatch<React.SetStateAction<number>>
}

const BorderDebuggerContext = createContext<BorderDebuggerContextProps | undefined>(undefined)

export const BorderDebuggerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bordersEnabled, setBordersEnabled] = useState(false)
  const [depth, setDepth] = useState(1)

  return (
    <BorderDebuggerContext.Provider value={{ bordersEnabled, setBordersEnabled, depth, setDepth }}>
      {children}
    </BorderDebuggerContext.Provider>
  )
}

export const useBorderDebugger = () => {
  const context = React.useContext(BorderDebuggerContext)

  if (!context) throw new Error('useBorderDebugger must be used within BorderDebuggerProvider')

  return context
}
