import { useRef } from 'react'
import { useRuioContext } from '@root/context/RuioContextProvider'
import RuioIcon from '@components/icons/RuioIcon'
import IconProps from '../../types/IconTypes'

import buttonStyles from '../../styles/Button.module.css'
import iconStyles from '../../styles/Icon.module.css'
import svgStyles from '../../styles/SVG.module.css'

function ChevronIcon() {
  return (
    <RuioIcon
      id="ruio-chevron"
      buttonClassName={`
          ruio-exclude
          ${buttonStyles['ruio-btn']}
          ${iconStyles['ruio-chevron']}
        `}
      svgClassName={` ${svgStyles['close-modal-svg']}`}
      svgViewBox="0 0 92 62"
    >
      <>
        {/* <svg width="92" height="62" viewBox="0 0 92 62" fill="none" xmlns="http://www.w3.org/2000/svg"> */}
        <path
          d="M10.9982 11.2911L46 46.2929L81.0018 11.2911"
          stroke="white"
          stroke-width="22"
          stroke-linecap="round"
        />
        {/* </svg> */}
      </>
    </RuioIcon>
  )
}

export default ChevronIcon
