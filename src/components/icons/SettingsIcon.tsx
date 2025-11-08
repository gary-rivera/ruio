import { useRuioContext } from '@root/context/RuioContextProvider'
import RuioIcon from '@components/icons/RuioIcon'
import IconProps from '@root/types/IconTypes'
import styles from '@root/styles/icons.module.css'
import SettingsSvg from '@assets/svg/ruio-settings-icon.svg?react'

function SettingsIcon({ onClick }: IconProps) {
  const { ruioEnabled } = useRuioContext()

  const buttonClass = `${styles.iconButton} ${ruioEnabled ? styles.iconButtonActive : styles.iconButtonInactive}`

  return (
    <RuioIcon id="ruio-settings-icon" onClick={onClick} buttonClassName={buttonClass}>
      <SettingsSvg className={styles.iconSvg} />
    </RuioIcon>
  )
}

export default SettingsIcon
