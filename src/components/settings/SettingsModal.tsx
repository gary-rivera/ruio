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

// Visual feedback configuration
const FLASH_DURATION_MS = 600
const MIN_DEPTH = 0
const APPROACHING_MIN_DEPTH = 1

// Visual feedback colors
const LIMIT_REACHED_COLOR = '#e74c3c'
const APPROACHING_LIMIT_COLOR = '#f39c12'
const TRANSITION_TIMING = 'color 0.15s ease-in-out'

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

  // keep user input depth in sync with actual depth
  useEffect(() => {
    setTempDepth(depth.toString())
  }, [depth])

  const clampDepthToValidRange = (value: number): number => {
    return Math.max(MIN_DEPTH, Math.min(value, maxDepth))
  }

  const triggerFlashFeedback = (flashType: 'limit' | 'warning'): void => {
    const setFlashState = flashType === 'limit' ? setShowLimitFlash : setShowWarningFlash
    setFlashState(true)
    setTimeout(() => setFlashState(false), FLASH_DURATION_MS)
  }

  const calculateDepthAfterOperation = (operation: 'increment' | 'decrement'): number => {
    return operation === 'increment' ? depth + 1 : depth - 1
  }

  const isAtOrBeyondLimit = (newDepth: number, operation: 'increment' | 'decrement'): boolean => {
    const atMaximum = operation === 'increment' && (newDepth >= maxDepth || depth >= maxDepth)
    const atMinimum = operation === 'decrement' && (newDepth <= MIN_DEPTH || depth <= MIN_DEPTH)
    return atMaximum || atMinimum
  }

  const isApproachingLimit = (newDepth: number, operation: 'increment' | 'decrement'): boolean => {
    const approachingMaximum = operation === 'increment' && newDepth === maxDepth - 1
    const approachingMinimum = operation === 'decrement' && newDepth === APPROACHING_MIN_DEPTH
    return approachingMaximum || approachingMinimum
  }

  const getDepthInputColor = (): string => {
    if (showLimitFlash) return LIMIT_REACHED_COLOR
    if (showWarningFlash) return APPROACHING_LIMIT_COLOR
    return '' // default color
  }

  function adjustDepth(operation: 'increment' | 'decrement'): void {
    const requestedDepth = calculateDepthAfterOperation(operation)
    const validDepth = clampDepthToValidRange(requestedDepth)

    // which visual feedback to provide given current depth
    if (isAtOrBeyondLimit(validDepth, operation)) {
      triggerFlashFeedback('limit')
    } else if (isApproachingLimit(validDepth, operation)) {
      triggerFlashFeedback('warning')
    }

    setDepth(validDepth)
    setTempDepth(validDepth.toString())
  }

  function handleDepthChange(event: ChangeEvent<HTMLInputElement>) {
    setTempDepth(event.target.value)
  }

  function handleDepthConfirm(): void {
    const parsedValue = parseInt(tempDepth, 10)

    if (isNaN(parsedValue)) {
      setTempDepth(depth.toString())
      return
    }

    const validDepth = clampDepthToValidRange(parsedValue)
    setDepth(validDepth)
    setTempDepth(validDepth.toString())
  }

  function handleReportIssue(): void {
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
                  style={{ color: getDepthInputColor(), transition: TRANSITION_TIMING }}
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
