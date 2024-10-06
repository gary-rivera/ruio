import { useRef } from 'react'
import { useRuioContext } from '@root/context/RuioContextProvider'
import RuioIcon from '@components/icons/RuioIcon'
import IconProps from '../../types/IconTypes'

import buttonStyles from '../../styles/Button.module.css'
import iconStyles from '../../styles/Icon.module.css'
import svgStyles from '../../styles/SVG.module.css'

function CloseModalIcon({ onClick }: IconProps) {
  return (
    <RuioIcon
      id="ruio-close-icon"
      onClick={onClick}
      buttonClassName={`
          ${buttonStyles['ruio-btn']}
          ${iconStyles['close-modal-btn']}
        `}
      svgClassName={` ${svgStyles['close-modal-svg']}`}
      svgViewBox="0 0 94 93"
    >
      <>
        <path
          d="M11.9982 11.2911L82.7089 82.0018M11.2911 82.0018L82.0018 11.2911"
          stroke="white"
          strokeWidth="22"
          strokeLinecap="round"
        />
      </>
    </RuioIcon>
  )
}

export default CloseModalIcon
