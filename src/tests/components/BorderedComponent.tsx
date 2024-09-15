import React, { useEffect, useRef } from 'react'
import { applyBorders } from '@utils/applyBorders'

interface BorderedComponentProps {
  depth: number
  apply: boolean
}

export const BorderedComponent: React.FC<BorderedComponentProps> = ({ depth, apply }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      applyBorders(containerRef.current, depth, apply)
    }
  }, [depth, apply])

  return <div ref={containerRef}>Bordered Component</div>
}
