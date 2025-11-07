import RuioIcon from '@components/icons/RuioIcon'
import styles from '@root/styles/icons.module.css'

type ChevronIconProps = {
  isOpen?: boolean
}

function ChevronIcon({ isOpen }: ChevronIconProps) {
  const buttonClass = `${styles.chevronButton} ${isOpen ? styles.chevronActive : styles.chevronInactive}`

  return (
    <RuioIcon
      id="ruio-chevron"
      buttonClassName={buttonClass}
      svgClassName={styles.chevronSvg}
      svgViewBox="0 0 92 62"
      pulseEnabled={false}
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
