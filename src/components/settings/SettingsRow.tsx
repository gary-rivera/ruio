import { ReactNode, CSSProperties, useState } from 'react'
import divStyles from '../../styles/Div.module.css'

type SettingsRowProps = {
  title: string
  containerID: string
  inputContainerClassName: string
  inputContainerStyling?: CSSProperties
  children: ReactNode
  allowCustomEvents?: boolean
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

function SettingsRow({
  title,
  containerID,
  inputContainerClassName,
  inputContainerStyling,
  children,
  allowCustomEvents = false,
  isOpen,
}: SettingsRowProps) {
  const boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'

  return (
    <div
      id={containerID}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '0.25rem 0rem',
        fontSize: '0.9rem',
      }}
    >
      <h4 style={{ margin: 0, fontWeight: '400' }}>{title}</h4>
      <div
        className={`ruio-settings-input-container ${inputContainerClassName} ${isOpen ? divStyles['ruio-input-active'] : ''}`}
        style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#3C3F3E',
          borderRadius: '8px',
          height: '2rem',
          width: '6.5rem',
          boxShadow,
          ...inputContainerStyling,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default SettingsRow
