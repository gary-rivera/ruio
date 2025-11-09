import { MouseEvent } from 'react'
import Icon from '@components/icons/Icon'
import styles from '@root/styles/icons.module.css'
import CloseSvg from '@assets/svg/ruio-close-icon.svg?react'

type CloseModalIconv2Props = {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  buttonStyleKey?: string
}

function CloseModalIconv2({ onClick }: CloseModalIconv2Props) {
  return (
    <Icon
      id="ruio-close-modal-icon"
      onClick={onClick}
      buttonClassName={styles.closeButton}
      pulseEnabled={false}
    >
      <CloseSvg className={styles.closeSvg} />
    </Icon>
  )
}

export default CloseModalIconv2
