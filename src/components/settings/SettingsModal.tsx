import { ReactNode, ChangeEvent, useState } from 'react'
import { useRuioContext } from '@root/context/RuioContextProvider'
import SettingsRow from '@components/settings/SettingsRow'

import buttonStyles from '../../styles/Button.module.css'
// import dividerStyles from '../styles/HorizontalDivider.module.css'
import inputStyles from '../../styles/Input.module.css'
import selectStyles from '../../styles/Select.module.css'

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  footer?: ReactNode
  position: { right: number; bottom: number }
}
const boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'

function SettingsModal({ isOpen, onClose, position }: SettingsModalProps) {
  if (!isOpen) return null

  const { depth, setDepth } = useRuioContext()
  const [tempDepth, setTempDepth] = useState<string>(depth.toString())

  function adjustStylingDepth(operation: 'increment' | 'decrement') {
    console.log('[adjustStylingDepth] called with: ', operation)
    setDepth((prevDepth) => {
      const newDepth = operation === 'increment' ? prevDepth + 1 : prevDepth - 1
      setTempDepth(newDepth.toString())
      return newDepth
    })
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setTempDepth(event.target.value)
  }

  function handleConfirm() {
    const value = parseInt(tempDepth, 10)
    if (!isNaN(value)) {
      setDepth(value)
    }
    setTempDepth(value.toString())
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
                strokeWidth="5"
                strokeLinecap="round"
                shapeRendering="crispEdges"
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
            containerID="ruio-settings-depth-row"
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
                  onClick={() => adjustStylingDepth('decrement')}
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
                  value={tempDepth}
                  onChange={handleChange}
                  onBlur={handleConfirm}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    e.key === 'Enter' && handleConfirm()
                  }
                  style={{
                    alignSelf: 'center',
                    width: '2.5rem',
                    fontSize: 'inherit',
                    padding: '0.2rem',
                    textAlign: 'center',
                  }}
                />
                <button
                  className={buttonStyles['ruio-btn']}
                  onClick={() => adjustStylingDepth('increment')}
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
            containerID="ruio-settings-theme-row"
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
            containerID="ruio-settings-opacity-row"
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
        <span style={{ color: '#5E5E5E' }}> Report an issue</span>
      </footer>
    </div>
  )
}

export default SettingsModal
