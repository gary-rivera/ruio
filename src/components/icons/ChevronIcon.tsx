import { useRef } from 'react'
import { useRuioContext } from '@root/context/RuioContextProvider'
import RuioIcon from '@components/icons/RuioIcon'
import IconProps from '../../types/IconTypes'

import buttonStyles from '../../styles/Button.module.css'
import iconStyles from '../../styles/Icon.module.css'
import svgStyles from '../../styles/SVG.module.css'

type ChevronIconProps = {
  isOpen?: boolean
}

function ChevronIcon({ isOpen }: ChevronIconProps) {
  return (
    <RuioIcon
      id="ruio-chevron"
      buttonClassName={`
          ${buttonStyles['ruio-btn']}
          ${iconStyles.chevron}
          ${isOpen ? iconStyles.chevronActive : iconStyles.chevronInactive}
        `}
      svgClassName={` ${svgStyles['ruio-chevron-svg']}`}
      svgViewBox="0 0 92 62"
    >
      <path
        d="M7.99823 8.29111L43 43.2929L78.0018 8.29112"
        stroke="white"
        strokeWidth="16"
        strokeLinecap="round"
      />
    </RuioIcon>
  )
}

export default ChevronIcon
