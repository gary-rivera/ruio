import RuioIcon from '@components/icons/RuioIcon'
import styles from '@root/styles/icons.module.css'
import ChevronSvg from '@assets/svg/ruio-chevron-icon.svg?react'

type ChevronIconProps = {
  isOpen?: boolean
}

function ChevronIcon({ isOpen }: ChevronIconProps) {
  const buttonClass = `${styles.chevronButton} ${isOpen ? styles.chevronActive : styles.chevronInactive}`

  return (
    <RuioIcon id="ruio-chevron" buttonClassName={buttonClass} pulseEnabled={false}>
      <ChevronSvg className={styles.chevronSvg} />
    </RuioIcon>
  )
}

export default ChevronIcon
