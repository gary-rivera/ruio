import { ReactNode, MouseEvent, useState } from 'react'
import buttonStyles from '../../styles/Button.module.css'

type RuioIconProps = {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  children: ReactNode
  buttonClassName?: string
  svgClassName?: string
  pulseEnabled?: boolean
}

function RuioIcon({
  onClick,
  children,
  buttonClassName = '',
  svgClassName = '',
  pulseEnabled = true,
}: RuioIconProps) {
  const [shouldPulse, setShouldPulse] = useState(false)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick(event)
    console.log('hit handleClick event :)')
    if (pulseEnabled) {
      setShouldPulse(true)

      setTimeout(() => {
        setShouldPulse(false)
      }, 150)
    }
  }

  return (
    <button
      className={`ruio-exclude ${buttonClassName} ${shouldPulse ? buttonStyles.pulse : ''}`}
      onClick={handleClick}
    >
      <svg
        className={`ruio-exclude ${svgClassName}`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
    </button>
  )
}

export default RuioIcon
