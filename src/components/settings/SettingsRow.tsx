import { ReactNode, CSSProperties, useState } from 'react'
import divStyles from '../../styles/Div.module.css'
import ChevronIcon from '@components/icons/ChevronIcon'

type SettingsRowProps = {
  title: string
  containerID: string
  inputContainerClassName: string
  inputContainerStyling?: CSSProperties
  children: ReactNode
  allowCustomEvents?: boolean
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  icon?: ReactNode
}

function SettingsRow({
  title,
  containerID,
  inputContainerClassName,
  inputContainerStyling,
  children,
  allowCustomEvents = false,
  isOpen,
  setIsOpen,
  icon,
}: SettingsRowProps) {
  const boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget || event.target === event.currentTarget.firstChild) {
      if (allowCustomEvents && setIsOpen) setIsOpen(!isOpen)
    }
  }

  return (
    <div
      id={containerID}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.9rem',
      }}
    >
      <h4 style={{ margin: 0, fontWeight: '400' }}>{title}</h4>
      <div
        className={`ruio-settings-input-container ${inputContainerClassName} ${isOpen ? divStyles['ruio-input-active'] : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          alignItems: 'center',
          justifyItems: 'center',
          // padding: '0 0.5rem',
          backgroundColor: '#3C3F3E',
          borderRadius: '8px',
          height: '2rem',
          width: '6.5rem',
          // maxWidth: '6rem',
          position: 'relative',
          boxShadow,
          ...inputContainerStyling,
        }}
        onClick={handleClick}
      >
        {children}
        {icon && <ChevronIcon />}
      </div>
    </div>
  )
}

export default SettingsRow
