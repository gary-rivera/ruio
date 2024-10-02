import { ReactNode, CSSProperties } from 'react'

type SettingsRowProps = {
  title: string
  containerID: string
  inputContainerClassName: string
  inputContainerStyling?: CSSProperties
  children: ReactNode
}

function SettingsRow({
  title,
  containerID,
  inputContainerClassName,
  inputContainerStyling,
  children,
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
        className={`ruio-settings-input-container ${inputContainerClassName}`}
        style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#3C3F3E',
          borderRadius: '0.5rem',
          height: '2.1rem',
          width: '7rem',
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
