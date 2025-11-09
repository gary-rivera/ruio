import { MouseEvent } from 'react'
import { useRuioContext } from '@root/context/RuioContextProvider'
import Icon from '@components/icons/Icon'
import IconProps from '@root/types/IconTypes'
import styles from '@root/styles/icons.module.css'
import ElementSelectSvg from '@assets/svg/ruio-element-select-icon.svg?react'

function ElementSelectIcon({ onClick }: IconProps) {
  const { toggleElementPicker, ruioEnabled } = useRuioContext()

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    toggleElementPicker()
    onClick?.(event)
  }

  const buttonClass = `${styles.iconButton} ${ruioEnabled ? styles.iconButtonActive : styles.iconButtonInactive}`

  return (
    <Icon id="ruio-element-select-icon" onClick={handleClick} buttonClassName={buttonClass}>
      <ElementSelectSvg className={styles.iconSvg} />
    </Icon>
  )
}

export default ElementSelectIcon
