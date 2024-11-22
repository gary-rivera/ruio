import { ReactNode, ChangeEvent, useState, memo } from 'react'
import { useRuioContext } from '@root/context/RuioContextProvider'
import SettingsRow from '@components/settings/SettingsRow'
import ColorPaletteDropdown from '@components/settings/ColorPaletteDropdown'
import CloseModalIcon from '@components/icons/CloseModalIcon'
import ChevronIcon from '@components/icons/ChevronIcon'
// import CloseModalIconv2 from '@components/icons/Iconv2'

import settingsModalStyles from '../../styles/SettingsModal.module.css'
import settingsRowStyles from '../../styles/SettingsRow.module.css'

import buttonStyles from '../../styles/Button.module.css'
import inputStyles from '../../styles/Input.module.css'

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  footer?: ReactNode
}

function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { depth, setDepth } = useRuioContext()

  const [tempDepth, setTempDepth] = useState<string>(depth.toString())
  const [themeDropdownIsOpen, setThemeDropdownIsOpen] = useState<boolean>(false)

  function adjustDepth(operation: 'increment' | 'decrement') {
    const newDepth = operation === 'increment' ? depth + 1 : depth - 1
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
    <div
      id="ruio-settings-modal-container"
      className={`${settingsModalStyles.modalContainer} ${isOpen ? settingsModalStyles.open : ''}`}
    >
      <div className={settingsModalStyles.mainContent}>
        <div className={settingsModalStyles.header}>
          <h2 className={settingsModalStyles.title}>Settings</h2>

          <CloseModalIcon onClick={onClose} buttonStyleKey="close-modal-btn" />
        </div>
        <section className={settingsModalStyles.category}>
          <div className={settingsModalStyles.categorySubtitleSection}>
            <h4 className={settingsModalStyles.categorySubtitle}>Outline configuration</h4>
            <hr className={settingsModalStyles.categoryDividerBar} />
          </div>

          <SettingsRow
            title="Depth"
            containerID="ruio-settings-depth-row"
            inputContainerClassName={settingsRowStyles.depthControlContainer}
            children={
              <>
                <button
                  className={`
                    ${buttonStyles['ruio-btn']}
                    ${settingsRowStyles.settingRowButton}
                    ${settingsRowStyles.depthControlButtonLeft}
                  `}
                  onClick={() => adjustDepth('decrement')}
                >
                  -
                </button>
                <input
                  className={`${inputStyles['ruio-input']} ${settingsRowStyles.depthControlInput}`}
                  type="text"
                  value={tempDepth}
                  onChange={handleDepthChange}
                  onBlur={handleDepthConfirm}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    e.key === 'Enter' && handleDepthConfirm()
                  }
                />
                <button
                  className={`${buttonStyles['ruio-btn']} ${settingsRowStyles.settingRowButton} ${settingsRowStyles.depthControlButtonLeft}`}
                  onClick={() => adjustDepth('increment')}
                >
                  +
                </button>
              </>
            }
          />

          <SettingsRow
            title="Theme"
            containerID="ruio-settings-theme-row"
            inputContainerClassName={`
              ${settingsRowStyles.themeControlContainer}
              ${themeDropdownIsOpen ? settingsRowStyles.controlContainerActive : ''}
            `}
            children={
              <>
                <ColorPaletteDropdown isOpen={themeDropdownIsOpen} setIsOpen={setThemeDropdownIsOpen} />
                <ChevronIcon isOpen={themeDropdownIsOpen} />
              </>
            }
            allowCustomEvents
            isOpen={themeDropdownIsOpen}
            setIsOpen={setThemeDropdownIsOpen}
          />

          {/* outline vs. border toggle */}
          {/* toggle annotations toggle (meta details about element such as class, dimensions) */}
          {/* toggle horizontal/vertical halfway line */}

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

      <footer className={settingsModalStyles.modalFooter}>
        {/* <span className={settingsModalStyles.reportIssue}> Report an issue</span> */}
        {/* TODO: instead of report issue, put description of the setting being hovered over */}
      </footer>
    </div>
  )
}

export default memo(SettingsModal, (prevProps, nextProps) => {
  return prevProps.isOpen === nextProps.isOpen && prevProps.onClose === nextProps.onClose
})
