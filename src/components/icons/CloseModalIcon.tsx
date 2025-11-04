import { MouseEvent } from 'react'
import RuioIcon from '@components/icons/RuioIcon'

import buttonStyles from '../../styles/Button.module.css'
import iconStyles from '../../styles/Icon.module.css'
import svgStyles from '../../styles/SVG.module.css'

type CloseModalIconv2Props = {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  buttonStyleKey?: string
}

function CloseModalIconv2({ onClick, buttonStyleKey = '' }: CloseModalIconv2Props) {
  return (
    <RuioIcon
      id="ruio-close-modal-icon"
      onClick={onClick}
      buttonClassName={`
        ${buttonStyles['ruio-btn']}
        ${iconStyles[buttonStyleKey]}
      `}
      svgClassName={svgStyles['close-modal-svg']}
      svgViewBox="0 0 94 93"
      pulseEnabled={false}
    >
      <>
        <path
          d="M11.9981 11.291L82.7088 82.0017M11.291 82.0017L82.0017 11.291"
          strokeWidth="22"
          strokeLinecap="round"
        />
      </>
    </RuioIcon>
  )
}

export default CloseModalIconv2
