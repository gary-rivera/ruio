import { useRuioContext } from '@root/context/RuioContextProvider'
import RuioIcon from '@components/icons/RuioIcon'
import IconProps from '../../types/IconTypes'
import styles from '@root/styles/icons.module.css'

function SettingsIcon({ onClick }: IconProps) {
  const { ruioEnabled } = useRuioContext()

  const buttonClass = `${styles.iconButton} ${ruioEnabled ? styles.iconButtonActive : styles.iconButtonInactive}`

  return (
    <RuioIcon
      id="ruio-settings-icon"
      onClick={onClick}
      buttonClassName={buttonClass}
      svgClassName={styles.iconSvg}
    >
      <>
        <path
          className={styles.svgOutline}
          d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className={styles.svgBarBg}
          d="M15.5699 18.5001V14.6001"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className={styles.svgBarBg}
          d="M15.5699 7.45V5.5"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className={styles.svgDial}
          d="M15.57 12.65C17.0059 12.65 18.17 11.4859 18.17 10.05C18.17 8.61401 17.0059 7.44995 15.57 7.44995C14.134 7.44995 12.97 8.61401 12.97 10.05C12.97 11.4859 14.134 12.65 15.57 12.65Z"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className={styles.svgBarBg}
          d="M8.43005 18.5V16.55"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className={styles.svgBarBg}
          d="M8.43005 9.4V5.5"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className={styles.svgDial}
          d="M8.42996 16.5501C9.8659 16.5501 11.03 15.386 11.03 13.9501C11.03 12.5142 9.8659 11.3501 8.42996 11.3501C6.99402 11.3501 5.82996 12.5142 5.82996 13.9501C5.82996 15.386 6.99402 16.5501 8.42996 16.5501Z"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    </RuioIcon>
  )
}

export default SettingsIcon
