import RuioIcon from '@components/icons/RuioIcon'
import styles from '@root/styles/icons.module.css'
import CheckmarkSvg from '@assets/svg/ruio-checkmark-icon.svg?react'

type ChevronIconProps = {
  isOpen?: boolean
}

function CheckmarkIcon({ isOpen }: ChevronIconProps) {
  return (
    <RuioIcon id="ruio-checkmark" buttonClassName={styles.checkmarkIcon} pulseEnabled={false}>
      <CheckmarkSvg className={styles.checkmarkPath} />
    </RuioIcon>
  )
}

export default CheckmarkIcon
