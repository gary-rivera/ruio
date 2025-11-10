import { ReactNode, MouseEvent, useState, useCallback } from 'react'
import { ICON_HOVER_TRANSITION_MS } from '@constants/index'
import baseStyles from '@root/styles/base.module.css'

type IconProps = {
  id: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  children: ReactNode
  buttonClassName?: string
  svgClassName?: string
  pulseEnabled?: boolean
}

function Icon({ id, onClick, children, buttonClassName = '', pulseEnabled = true }: IconProps) {
  const [shouldPulse, setShouldPulse] = useState(false)

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)

      if (pulseEnabled) {
        setShouldPulse(true)
        setTimeout(() => {
          setShouldPulse(false)
        }, ICON_HOVER_TRANSITION_MS)
      }
    },
    [onClick, pulseEnabled],
  )

  const buttonClasses = `${buttonClassName} ${shouldPulse ? baseStyles.pulse : ''}`

  return (
    <button id={id} className={buttonClasses} onClick={handleClick}>
      {children}
    </button>
  )
}

export default Icon
