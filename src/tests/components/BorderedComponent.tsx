import React, { useEffect, useRef } from 'react'
import { applyOutlineUI } from '@utils/applyOutlineUI'

interface BorderedComponentProps {
  depth: number
  apply: boolean
}

export const BorderedComponent: React.FC<BorderedComponentProps> = ({ depth, apply }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      applyOutlineUI(containerRef.current, depth, apply)
    }
  }, [depth, apply])

  return <div ref={containerRef}>Bordered Component</div>
}
