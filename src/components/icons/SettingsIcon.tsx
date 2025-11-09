import { useRuioContext } from '@root/context/RuioContextProvider'
import Icon from '@components/icons/Icon'
import IconProps from '@root/types/IconTypes'
import styles from '@root/styles/icons.module.css'
import SettingsSvg from '@assets/svg/ruio-settings-icon.svg?react'

function SettingsIcon({ onClick }: IconProps) {
  const { ruioEnabled } = useRuioContext()

  const buttonClass = `${styles.iconButton} ${ruioEnabled ? styles.iconButtonActive : styles.iconButtonInactive}`

  return (
    <Icon id="ruio-settings-icon" onClick={onClick} buttonClassName={buttonClass}>
      <SettingsSvg className={styles.iconSvg} />
    </Icon>
  )
}

export default SettingsIcon
