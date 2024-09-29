import { ReactNode, MouseEvent } from 'react'

type RuioIconProps = {
  onClick: (event: MouseEvent<HTMLDivElement>) => void
  children: ReactNode
  containerClassName?: string
  buttonClassName?: string
  svgClassName?: string
}

function RuioIcon({
  onClick,
  children,
  containerClassName = '',
  buttonClassName = '',
  svgClassName = '',
}: RuioIconProps) {
  return (
    <div className={`ruio-exclude ${containerClassName}`} onClick={onClick}>
      <button className={`ruio-exclude ${buttonClassName}`}>
        <svg
          className={`ruio-exclude ${svgClassName}`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {children}
        </svg>
      </button>
    </div>
  )
}

export default RuioIcon
