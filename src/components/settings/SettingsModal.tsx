import { ReactNode, ChangeEvent, useState } from 'react'
import { useRuioContext } from '@root/context/RuioContextProvider'
import SettingsRow from '@components/settings/SettingsRow'
import ColorPaletteDropdown from '@components/settings/ColorPaletteDropdown'
// import RuioCloseModalIcon from '@components/icons/RuioCloseModalIcon'

import buttonStyles from '../../styles/Button.module.css'
import inputStyles from '../../styles/Input.module.css'
import selectStyles from '../../styles/Select.module.css'

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  footer?: ReactNode
  settingsModalClassName?: string
}

const boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'

function SettingsModal({ isOpen, onClose, settingsModalClassName }: SettingsModalProps) {
  if (!isOpen) return null

  const { depth, setDepth } = useRuioContext()
  const [tempDepth, setTempDepth] = useState<string>(depth.toString())
  const [themeDropdownIsOpen, setThemeDropdownIsOpen] = useState<boolean>(false)

  function adjustStylingDepth(operation: 'increment' | 'decrement') {
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
      className={settingsModalClassName}
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

        borderRadius: '10px',
        position: 'absolute',
        right: '0',
        bottom: '0',
        padding: '1rem 2rem',
        fontSize: '1rem',
        boxShadow:
          'rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset',
      }}
    >
      <div className="ruio-settings-main-content">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            gap: '1rem', // Space between h2 and button
            width: '100%',
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
          {/* <RuioCloseModalIcon onClick={onClose} /> */}
        </div>
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
                    borderRadius: '8px',
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
                    borderRadius: '8px',
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
            inputContainerStyling={{
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              cursor: 'crosshair',
            }}
            children={
              <ColorPaletteDropdown isOpen={themeDropdownIsOpen} setIsOpen={setThemeDropdownIsOpen} />
            }
            allowCustomEvents
            isOpen={themeDropdownIsOpen}
            setIsOpen={setThemeDropdownIsOpen}
          />

          <SettingsRow
            title="Border/Outline"
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
