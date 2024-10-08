import { ReactNode, MouseEvent, useState, useCallback, useMemo, memo } from 'react'
import { useRuioContext } from '@context/RuioContextProvider'

import buttonStyles from '../../styles/Button.module.css'

type RuioIconProps = {
  id: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  children: ReactNode
  buttonClassName?: string
  svgClassName?: string
  svgViewBox?: string
  pulseEnabled?: boolean
  shouldMemoize?: boolean
}

function RuioIcon({
  id,
  onClick,
  children,
  buttonClassName = '',
  svgClassName = '',
  svgViewBox = '0 0 24 24',
  pulseEnabled = true,
  shouldMemoize = true,
}: RuioIconProps) {
  const { ruioEnabled } = useRuioContext()
  const [shouldPulse, setShouldPulse] = useState(false)

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick && onClick(event)
      // TODO: reenable, just debugging
      if (pulseEnabled) {
        setShouldPulse(true)

        setTimeout(() => {
          setShouldPulse(false)
        }, 150)
      }
    },
    [onClick],
  )

  const buttonClasses = shouldMemoize
    ? useMemo(() => {
        return `${buttonClassName} ${shouldPulse ? buttonStyles.pulse : ''}`
      }, [buttonClassName, shouldPulse])
    : `${buttonClassName} ${shouldPulse ? buttonStyles.pulse : ''}`

  // Conditionally memoize the svg classes
  const svgClasses = shouldMemoize
    ? useMemo(() => {
        return `${svgClassName}`
      }, [svgClassName])
    : `${svgClassName}`
  return (
    <button id={id} className={buttonClasses} onClick={handleClick}>
      <svg className={svgClasses} viewBox={svgViewBox} xmlns="http://www.w3.org/2000/svg">
        {children}
      </svg>
    </button>
  )
}

export default RuioIcon
