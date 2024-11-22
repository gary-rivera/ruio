import RuioIcon from '@components/icons/RuioIcon'

import buttonStyles from '../../styles/Button.module.css'
import iconStyles from '../../styles/Icon.module.css'
import svgStyles from '../../styles/SVG.module.css'

type ChevronIconProps = {
  isOpen?: boolean
}

function CheckmarkIcon({ isOpen }: ChevronIconProps) {
  return (
    <RuioIcon
      id="ruio-chevron"
      buttonClassName={`
          ${buttonStyles['ruio-btn']}
          ${iconStyles.checkmark}
        `}
      svgClassName={` ${svgStyles['ruio-chevron-svg']}`}
      svgViewBox="0 0 127 97"
      pulseEnabled={false}
    >
      <path
        d="M8 50L43.0018 85.0018L118.688 8.43771"
        stroke="white"
        strokeWidth="16"
        strokeLinecap="round"
      />
    </RuioIcon>
  )
}

export default CheckmarkIcon
