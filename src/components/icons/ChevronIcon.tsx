import Icon from '@components/icons/Icon'
import styles from '@root/styles/icons.module.css'
import ChevronSvg from '@assets/svg/ruio-chevron-icon.svg?react'

type ChevronIconProps = {
  isOpen?: boolean
}

function ChevronIcon({ isOpen }: ChevronIconProps) {
  const buttonClass = `${styles.chevronButton} ${isOpen ? styles.chevronActive : styles.chevronInactive}`

  return (
    <Icon id="ruio-chevron" buttonClassName={buttonClass} pulseEnabled={false}>
      <ChevronSvg className={styles.chevronSvg} />
    </Icon>
  )
}

export default ChevronIcon
