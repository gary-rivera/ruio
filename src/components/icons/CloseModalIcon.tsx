import { MouseEvent } from 'react'
import RuioIcon from '@components/icons/RuioIcon'
import styles from '@root/styles/icons.module.css'
import CloseSvg from '@assets/svg/ruio-close-icon.svg?react'

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
      pulseEnabled={false}
    >
      <CloseSvg className={styles.closeSvg} />
    </RuioIcon>
  )
}

export default CloseModalIconv2
