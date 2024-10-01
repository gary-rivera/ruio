import { ReactNode } from 'react'
import dividerStyles from '../styles/HorizontalDivider.module.css'

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
    inputClassName: string
    children: ReactNode
  }

  function SettingsRow({ title, containerClassName, inputClassName, children }: SettingsRowProps) {
    return (
      <div
        className={containerClassName}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <h4 style={{ margin: 0 }}>{title}</h4>
        <div className={`ruio-settings-input-container ${inputClassName}`}>{children}</div>
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

        backgroundColor: '#2D3130',
        border: '1px solid #06E5D5',
        color: 'white',
        width: '21vw',
        height: '15vw',
        // aspectRatio: '7 / 5', // Maintain 7:5 aspect ratio

        borderRadius: '1.5rem', // Use rem for relative border radius
        position: 'absolute',
        right: '2vw', // Position relative to the viewport width
        bottom: '2vw', // Position relative to the viewport width
        padding: '2rem', // Use percentage for padding to adjust dynamically
        fontSize: '1rem', // Base font size, adjust according to viewport
      }}
    >
      <div className="ruio-settings-main-content">
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.2rem',
          }}
        >
          <h2 style={{ margin: '0px' }}>Settings</h2>
          <button style={{ fontSize: 'inherit' }} onClick={onClose}>
            x
          </button>
        </header>
        <section className="ruio-outline-config" style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            className="ruio-settings-subtitle"
            style={{ display: 'flex', fontSize: '1rem', alignItems: 'end' }}
          >
            <h4 style={{ margin: 0 }}>Outline configuration</h4>
            <hr
              style={{ flex: 1, marginLeft: '0.5rem', border: 'none', borderTop: '1px solid #e0e0e0' }}
            />
          </div>
          <SettingsRow
            title="Depth"
            containerClassName="ruio-settings-depth-row"
            inputClassName="ruio-settings-depth-input"
            children={
              <>
                <button
                  type="button"
                  style={{
                    fontSize: 'inherit',
                    padding: '0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  value="5"
                  style={{
                    width: '2.5rem',
                    fontSize: 'inherit',
                    padding: '0.2rem',
                    textAlign: 'center',
                  }}
                />
                <button
                  type="button"
                  style={{
                    fontSize: 'inherit',
                    padding: '0.5rem',
                    cursor: 'pointer',
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
            inputClassName="ruio-theme-input-control"
            children={
              <>
                <select id="number-select" style={{ padding: '0.5rem', fontSize: 'inherit' }}>
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
            inputClassName="ruio-opacity-input-control"
            children={
              <>
                <input
                  id="opacity-input"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  style={{
                    width: '3rem',
                    padding: '0.4rem',
                    textAlign: 'center',
                    fontSize: 'inherit',
                  }}
                />
                <span>%</span>
              </>
            }
          />
        </section>
      </div>

      <footer
        style={{
          backgroundColor: '#1C2120',
          padding: '1rem', // Dynamic padding
          marginBottom: '-2rem', // Negate parent container's margin
          marginLeft: '-2rem', // Negate parent container's margin
          marginRight: '-2rem', // Negate parent container's margin
          height: 'auto', // Adjust height automatically based on content
          borderBottomLeftRadius: 'inherit',
          borderBottomRightRadius: 'inherit',
          fontSize: '0.8rem', // Inherit dynamic font size
        }}
      >
        <span style={{ fontStyle: 'italic' }}> Report an issue</span>
      </footer>
    </div>
  )
}

export default SettingsModal
