import { ReactNode, ChangeEvent, useState } from 'react'
import { useRuioContext } from '@root/context/RuioContextProvider'
import SettingsRow from '@components/settings/SettingsRow'
import ColorPaletteDropdown from '@components/settings/ColorPaletteDropdown'
import CloseModalIcon from '@components/icons/CloseModalIcon'

import settingsModalStyles from '../../styles/SettingsModal.module.css'
import buttonStyles from '../../styles/Button.module.css'
import inputStyles from '../../styles/Input.module.css'

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  footer?: ReactNode
}

const boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'

function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null

  const { depth, setDepth } = useRuioContext()
  const [tempDepth, setTempDepth] = useState<string>(depth.toString())
  const [themeDropdownIsOpen, setThemeDropdownIsOpen] = useState<boolean>(false)

  function adjustDepthStyling(operation: 'increment' | 'decrement') {
    const newDepth = operation === 'increment' ? depth + 1 : depth - 1 // Directly reference depth
    setDepth(newDepth)
    setTempDepth(newDepth.toString())
  }

  function handleDepthChange(event: ChangeEvent<HTMLInputElement>) {
    setTempDepth(event.target.value)
  }

  function handleDepthConfirm() {
    const value = parseInt(tempDepth, 10)
    if (!isNaN(value)) {
      setDepth(value)
    }
    setTempDepth(value.toString())
  }

  return (
    <div className={settingsModalStyles['modal-container']}>
      <div className={settingsModalStyles['main-content']}>
        <div className={settingsModalStyles['header']}>
          <h2 className={settingsModalStyles['title']}>Settings</h2>
          <CloseModalIcon onClick={onClose} />
        </div>
        <section className={settingsModalStyles['category']}>
          <div className={settingsModalStyles['category-subtitle-section']}>
            <h4 className={settingsModalStyles['category-subtitle']}>Outline configuration</h4>
            <hr className={settingsModalStyles['category-divider-bar']} />
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
                  onClick={() => adjustDepthStyling('decrement')}
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
                  onChange={handleDepthChange}
                  onBlur={handleDepthConfirm}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    e.key === 'Enter' && handleDepthConfirm()
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
                  onClick={() => adjustDepthStyling('increment')}
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

          {/* <SettingsRow
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
          /> */}
        </section>
      </div>

      <footer className={settingsModalStyles['modal-footer']}>
        <span className={settingsModalStyles['report-issue']}> Report an issue</span>
      </footer>
    </div>
  )
}

export default SettingsModal
