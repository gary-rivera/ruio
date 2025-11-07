import RuioIcon from '@components/icons/RuioIcon'
import styles from '@root/styles/icons.module.css'

type ChevronIconProps = {
  isOpen?: boolean
}

function CheckmarkIcon({ isOpen }: ChevronIconProps) {
  return (
    <RuioIcon
      id="ruio-chevron"
      buttonClassName={styles.checkmarkIcon}
      svgClassName={styles.checkmarkIcon}
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
