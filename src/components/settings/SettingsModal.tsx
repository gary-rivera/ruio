import { ReactNode, CSSProperties } from 'react'

import buttonStyles from '../../styles/Button.module.css'
import dividerStyles from '../styles/HorizontalDivider.module.css'
import inputStyles from '../../styles/Input.module.css'
import selectStyles from '../../styles/Select.module.css'

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  footer?: ReactNode
  position: { right: number; bottom: number }
}

function SettingsModal({ isOpen, onClose, position, title, footer }: SettingsModalProps) {
  if (!isOpen) return null

  console.log('[SettingsModal] received coordinates: ', {
    right: position.right,
    bottom: position.bottom,
    offsetRight: position.right - 20,
    offsetBottom: position.bottom - 20,
  })

  const boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'

  type SettingsRowProps = {
    title: string
    containerClassName: string
    inputContainerClassName: string
    inputContainerStyling?: CSSProperties
    children: ReactNode
  }

  function SettingsRow({
    title,
    containerClassName,
    inputContainerClassName,
    inputContainerStyling,
    children,
  }: SettingsRowProps) {
    return (
      <div
        className={containerClassName}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '0.25rem 0rem',
          fontSize: '0.9rem',
        }}
      >
        <h4 style={{ margin: 0, fontWeight: '300' }}>{title}</h4>
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

  return (
    <div
      className="ruio-exclude ruio-settings-modal"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignContent: 'center',

        backgroundColor: '#323635',
        border: '0.1rem solid #06E5D5',
        color: 'white',
        width: '20vw',
        height: '15vw',

        borderRadius: '1rem',
        position: 'absolute',
        right: '1.25vw',
        bottom: '2vw',
        padding: '1rem 2rem',
        fontSize: '1rem',
        boxShadow:
          'rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset',
      }}
    >
      <div className="ruio-settings-main-content">
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1rem',
            marginBottom: '1rem',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: '500',
            }}
          >
            Settings
          </h2>
          <button
            className={buttonStyles['ruio-btn']}
            style={{
              fontSize: 'inherit',
              backgroundColor: 'inherit',
              color: '#FFFFFF',
            }}
            onClick={onClose}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 34 34"
              // fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7622 12.4937L29.0452 28.9625M11.8426 28.9625L29.1257 12.4937"
                stroke="#EAF8EF"
                stroke-width="5"
                stroke-linecap="round"
                shape-rendering="crispEdges"
              />
            </svg>
          </button>
        </header>
        <section
          className="ruio-outline-config"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            className="ruio-settings-subtitle-container"
            style={{
              display: 'flex',
              fontSize: '1rem',
              alignItems: 'center',
              color: '#A6A6A6',
              marginBottom: '0.15rem',
            }}
          >
            <h4
              style={{
                margin: 0,
                fontWeight: '400',
                fontSize: '0.9rem',
              }}
            >
              Outline configuration
            </h4>
            <hr
              style={{
                flex: 1,
                margin: 0,
                marginLeft: '1.75rem',
                border: 'none',
                borderTop: '0.1rem solid #5E5E5E',
              }}
            />
          </div>

          <SettingsRow
            title="Depth"
            containerClassName="ruio-settings-depth-row"
            inputContainerClassName="ruio-settings-depth-input"
            inputContainerStyling={{
              backgroundColor: 'inherit',
              justifyContent: 'space-between',
              boxShadow: 'none',
            }}
            children={
              <>
                <button
                  className={buttonStyles['ruio-btn']}
                  style={{
                    fontSize: 'inherit',
                    padding: '0.5rem',
                    width: '2.1rem',
                    cursor: 'pointer',
                    backgroundColor: '#3C3F3E',
                    borderRadius: '0.5rem',
                    color: '#FFFFFF',
                    boxShadow,
                  }}
                >
                  -
                </button>
                <input
                  className={inputStyles['ruio-input']}
                  type="text"
                  defaultValue="10"
                  style={{
                    width: '2.5rem',
                    fontSize: 'inherit',
                    padding: '0.2rem',
                    textAlign: 'center',
                  }}
                />
                <button
                  className={buttonStyles['ruio-btn']}
                  style={{
                    fontSize: 'inherit',
                    padding: '0.5rem',
                    width: '2.1rem',
                    cursor: 'pointer',
                    backgroundColor: '#3C3F3E',
                    borderRadius: '0.5rem',
                    color: '#FFFFFF',
                    boxShadow,
                  }}
                >
                  +
                </button>
              </>
            }
          />

          <SettingsRow
            title="Theme"
            containerClassName="ruio-settings-theme-row"
            inputContainerClassName="ruio-theme-input-control"
            children={
              <>
                <select
                  id="number-select"
                  className={selectStyles['ruio-select']}
                  style={{ padding: '0.5rem', fontSize: 'inherit', fontWeight: '200' }}
                >
                  {['default', 'dark', 'neon'].map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
              </>
            }
          />

          <SettingsRow
            title="Opacity"
            containerClassName="ruio-settings-opacity-row"
            inputContainerClassName="ruio-opacity-input-control"
            inputContainerStyling={{ display: 'flex', alignItems: 'center' }}
            children={
              <>
                <span
                  style={{
                    maxWidth: '1.5rem',
                    padding: 0,
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '300',
                    marginRight: '0.1rem',
                  }}
                >
                  100
                </span>
                <span style={{ color: 'gray', alignSelf: 'center' }}>%</span>
              </>
            }
          />
        </section>
      </div>

      <footer
        style={{
          backgroundColor: '#1C2120',
          padding: '1rem',
          marginBottom: '-1rem',
          marginLeft: '-2rem',
          marginRight: '-2rem',
          height: '8%',
          borderBottomLeftRadius: 'inherit',
          borderBottomRightRadius: 'inherit',
          fontSize: '0.8rem',
        }}
      >
        <span style={{ fontStyle: 'italic', color: '#5E5E5E' }}> Report an issue</span>
      </footer>
    </div>
  )
}

export default SettingsModal
