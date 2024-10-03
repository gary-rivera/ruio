import { ReactNode, CSSProperties, useState } from 'react'

type SettingsRowProps = {
  title: string
  containerID: string
  inputContainerClassName: string
  inputContainerStyling?: CSSProperties
  children: ReactNode
  applyOutline?: boolean
}

function SettingsRow({
  title,
  containerID,
  inputContainerClassName,
  inputContainerStyling,
  children,
  applyOutline = false,
}: SettingsRowProps) {
  const [isClicked, setIsClicked] = useState(false)
  const boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
  const handleClick = () => {
    setIsClicked(!isClicked)
  }

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
        onClick={handleClick}
        style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#3C3F3E',
          borderRadius: '8px',
          height: '2rem',
          width: '6.5rem',
          outline: isClicked && applyOutline ? '0.01rem solid #06E5D5' : undefined,
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
