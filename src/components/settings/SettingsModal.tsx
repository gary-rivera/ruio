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
          margin: '0.3rem 0rem',
        }}
      >
        <h4 style={{ margin: 0, fontWeight: '300' }}>{title}</h4>
        <div
          className={`ruio-settings-input-container ${inputContainerClassName}`}
          style={{
            display: 'flex',
            justifyContent: 'center',

            backgroundColor: '#383B3A',
            borderRadius: '0.5rem',
            width: '7rem',
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

        backgroundColor: '#2E3130',
        border: '2px solid #06E5D5',
        color: 'white',
        width: '21vw',
        height: '15vw',

        borderRadius: '1rem',
        position: 'absolute',
        right: '2vw',
        bottom: '2vw',
        padding: '1rem 2rem',
        fontSize: '1rem',
      }}
    >
      <div className="ruio-settings-main-content">
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.1rem',
          }}
        >
          <h2 style={{ margin: '0px' }}>Settings</h2>
          <button
            className={buttonStyles['ruio-btn']}
            style={{ fontSize: 'inherit', backgroundColor: 'none', color: '#FFFFFF' }}
            onClick={onClose}
          >
            x
          </button>
        </header>
        <section className="ruio-outline-config" style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            className="ruio-settings-subtitle"
            style={{ display: 'flex', fontSize: '1rem', alignItems: 'end', color: '#A6A6A6' }}
          >
            <h4 style={{ margin: 0, fontWeight: '400' }}>Outline configuration</h4>
            <hr
              style={{ flex: 1, marginLeft: '2rem', border: 'none', borderTop: '1.5px solid #5E5E5E' }}
            />
          </div>

          <SettingsRow
            title="Depth"
            containerClassName="ruio-settings-depth-row"
            inputContainerClassName="ruio-settings-depth-input"
            inputContainerStyling={{ backgroundColor: 'inherit', justifyContent: 'space-between' }}
            children={
              <>
                <button
                  className={buttonStyles['ruio-btn']}
                  type="button"
                  style={{
                    fontSize: 'inherit',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: '#383B3A',
                    borderRadius: '0.5rem',
                    color: '#FFFFFF',
                  }}
                >
                  -
                </button>
                <input
                  className={inputStyles['ruio-input']}
                  type="text"
                  value="10"
                  style={{
                    width: '2.5rem',
                    fontSize: 'inherit',
                    padding: '0.2rem',
                    textAlign: 'center',
                  }}
                />
                <button
                  className={buttonStyles['ruio-btn']}
                  type="button"
                  style={{
                    fontSize: 'inherit',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: '#383B3A',
                    borderRadius: '0.5rem',
                    color: '#FFFFFF',
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
            children={
              <>
                <input
                  id="opacity-input"
                  className={inputStyles['ruio-input']}
                  type="text"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue="75"
                  style={{
                    width: '3rem',
                    padding: '0.4rem',
                    textAlign: 'center',
                    fontSize: 'inherit',
                  }}
                />
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
          height: '10%',
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
