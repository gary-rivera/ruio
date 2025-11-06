import { ReactNode, ChangeEvent, useState, useEffect, memo } from 'react'
import { useRuioContext } from '@root/context/RuioContextProvider'
import SettingsRow from '@components/settings/SettingsRow'
import ColorPaletteDropdown from '@components/settings/ColorPaletteDropdown'
import CloseModalIcon from '@components/icons/CloseModalIcon'
import ChevronIcon from '@components/icons/ChevronIcon'
import { generateGitHubIssueUrl } from '@utils/githubIssue'

import settingsModalStyles from '../../styles/SettingsModal.module.css'
import settingsRowStyles from '../../styles/SettingsRow.module.css'

import buttonStyles from '../../styles/Button.module.css'
import inputStyles from '../../styles/Input.module.css'

type SettingsModalProps = { isOpen: boolean; onClose: () => void; title?: string; footer?: ReactNode }

// TODO: add settings row for border/outline toggle
// TODO: add settings row to clear local storage
function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    depth,
    setDepth,
    maxDepth,
    ruioEnabled,
    currentColorPalette,
    rootElement,
    isElementSelectionModeActive,
  } = useRuioContext()

  const [tempDepth, setTempDepth] = useState<string>(depth.toString())
  const [themeDropdownIsOpen, setThemeDropdownIsOpen] = useState<boolean>(false)
  const [showLimitFlash, setShowLimitFlash] = useState<boolean>(false)
  const [showWarningFlash, setShowWarningFlash] = useState<boolean>(false)

  // Sync tempDepth with depth changes (e.g., when depth is automatically clamped)
  useEffect(() => {
    setTempDepth(depth.toString())
  }, [depth])

  function adjustDepth(operation: 'increment' | 'decrement') {
    const newDepth = operation === 'increment' ? depth + 1 : depth - 1
    const clampedDepth = Math.max(0, Math.min(newDepth, maxDepth))

    // Check if we reached or exceeded a limit
    const hitLimit =
      (operation === 'increment' && (clampedDepth >= maxDepth || depth >= maxDepth)) ||
      (operation === 'decrement' && (clampedDepth <= 0 || depth <= 0))

    // Check if we're approaching the limit (one away from max or min)
    const approachingLimit =
      (operation === 'increment' && clampedDepth === maxDepth - 1) ||
      (operation === 'decrement' && clampedDepth === 1)

    if (hitLimit) {
      // Trigger the red flash
      setShowLimitFlash(true)
      setTimeout(() => setShowLimitFlash(false), 600)
    } else if (approachingLimit) {
      // Trigger the warning flash
      setShowWarningFlash(true)
      setTimeout(() => setShowWarningFlash(false), 600)
    }

    setDepth(clampedDepth)
    setTempDepth(clampedDepth.toString())
  }

  function handleDepthChange(event: ChangeEvent<HTMLInputElement>) {
    setTempDepth(event.target.value)
  }

  function handleDepthConfirm() {
    const value = parseInt(tempDepth, 10)
    if (!isNaN(value)) {
      const clampedValue = Math.max(0, Math.min(value, maxDepth))
      setDepth(clampedValue)
      setTempDepth(clampedValue.toString())
    } else {
      // Reset to current depth if invalid
      setTempDepth(depth.toString())
    }
  }

  function handleReportIssue() {
    const issueUrl = generateGitHubIssueUrl({
      ruioEnabled,
      depth,
      currentColorPalette,
      rootElement,
      isElementSelectionModeActive,
    })
    window.open(issueUrl, '_blank', 'noopener,noreferrer')
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
                  style={{
                    color: showLimitFlash ? '#e74c3c' : showWarningFlash ? '#f39c12' : '',
                    transition: 'color 0.15s ease-in-out',
                  }}
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
        <span className={settingsModalStyles.reportIssue} onClick={handleReportIssue}>
          <svg
            className={settingsModalStyles.reportIssueIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 8L3 11.6923L7 16M17 8L21 11.6923L17 16M14 4L10 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Report an issue
        </span>
      </footer>
    </div>
  )
}

export default memo(SettingsModal, (prevProps, nextProps) => {
  return prevProps.isOpen === nextProps.isOpen && prevProps.onClose === nextProps.onClose
})
