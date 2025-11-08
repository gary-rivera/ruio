import { MouseEvent } from 'react'
import { useRuioContext } from '@root/context/RuioContextProvider'
import RuioIcon from '@components/icons/RuioIcon'
import IconProps from '@root/types/IconTypes'
import styles from '@root/styles/icons.module.css'
import ElementSelectSvg from '@assets/svg/ruio-element-select-icon.svg?react'

function ElementSelectIcon({ onClick }: IconProps) {
  const { toggleElementSelectionMode, ruioEnabled } = useRuioContext()

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    toggleElementSelectionMode()
    onClick?.(event)
  }

  const buttonClass = `${styles.iconButton} ${ruioEnabled ? styles.iconButtonActive : styles.iconButtonInactive}`

  return (
    <RuioIcon id="ruio-element-select-icon" onClick={handleClick} buttonClassName={buttonClass}>
      <ElementSelectSvg className={styles.iconSvg} />
    </RuioIcon>
  )
}

export default ElementSelectIcon
