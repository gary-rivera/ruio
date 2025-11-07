import { MouseEvent } from 'react'
import RuioIcon from '@components/icons/RuioIcon'
import styles from '@root/styles/icons.module.css'

type CloseModalIconv2Props = {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  buttonStyleKey?: string
}

function CloseModalIconv2({ onClick }: CloseModalIconv2Props) {
  return (
    <RuioIcon
      id="ruio-close-modal-icon"
      onClick={onClick}
      buttonClassName={styles.closeButton}
      svgClassName={styles.closeSvg}
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
