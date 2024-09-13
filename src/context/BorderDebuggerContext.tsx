import React, { createContext, useState } from 'react'
import { useContext } from 'react'

interface BorderDebuggerContextProps {
  bordersEnabled: boolean
  setBordersEnabled: React.Dispatch<React.SetStateAction<boolean>>
  depth: number
  setDepth: React.Dispatch<React.SetStateAction<number>>
}

export const BorderDebuggerContext = createContext<
  BorderDebuggerContextProps | undefined
>(undefined)

export const BorderDebuggerProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [bordersEnabled, setBordersEnabled] = useState(false)
  const [depth, setDepth] = useState(1)

  return (
    <BorderDebuggerContext.Provider
      value={{ bordersEnabled, setBordersEnabled, depth, setDepth }}
    >
      {children}
    </BorderDebuggerContext.Provider>
  )
}

export const useBorderDebugger = () => {
  const context = useContext(BorderDebuggerContext)

  if (!context)
    throw new Error(
      'useBorderDebugger must be used within a BorderDebuggerProvider',
    )

  return context
}
