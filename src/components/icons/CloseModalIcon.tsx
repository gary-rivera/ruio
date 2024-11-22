import { MouseEvent } from 'react'
import CloseModalSvg from '@assets/svg/ruio-close-icon.svg?react'

import buttonStyles from '../../styles/Button.module.css'
import iconStyles from '../../styles/Icon.module.css'
import svgStyles from '../../styles/SVG.module.css'

type CloseModalIconv2Props = {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  buttonStyleKey?: string
}

function CloseModalIconv2({ onClick, buttonStyleKey = '' }: CloseModalIconv2Props) {
  return (
    <button
      className={`
      ${buttonStyles['ruio-btn']}
      ${iconStyles[buttonStyleKey]}
    `}
      onClick={(event) => onClick(event)}
    >
      <CloseModalSvg className={svgStyles['close-modal-svg']} />
    </button>
  )
}

export default CloseModalIconv2
