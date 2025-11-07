import { ReactNode, useCallback, memo } from 'react'
import styles from './SettingsRow.module.css'

type SettingsRowProps = {
  title: string
  containerID: string
  inputContainerClassName: string
  children: ReactNode
  allowCustomEvents?: boolean
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

function SettingsRow({
  title,
  containerID,
  inputContainerClassName,
  children,
  allowCustomEvents = false,
  isOpen,
  setIsOpen,
}: SettingsRowProps) {
  const handleClick = useCallback(() => {
    if (allowCustomEvents && setIsOpen) setIsOpen(!isOpen)
  }, [allowCustomEvents, isOpen, setIsOpen])

  return (
    <div id={containerID} className={styles.container}>
      <h4 className={styles.title}>{title}</h4>
      <div
        className={`
          ${inputContainerClassName}
          ${styles.controlContainer}
        `}
        onClick={handleClick}
      >
        {children}
      </div>
    </div>
  )
}

export default memo(SettingsRow, (prevProps, nextProps) => {
  return prevProps.isOpen === nextProps.isOpen && prevProps.children === nextProps.children
})
