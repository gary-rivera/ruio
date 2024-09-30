import { MouseEvent } from 'react'
import { useRuioContext } from '@root/context/RuioContextProvider'
import RuioIcon from './RuioIcon'

// styling modules
import buttonStyles from '../styles/Button.module.css'
import svgStyles from '../styles/SVG.module.css'
import divStyles from '../styles/Div.module.css'

function ElementSelectIcon() {
  const { toggleElementSelectionMode, ruioEnabled } = useRuioContext()

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    toggleElementSelectionMode()
  }

  return (
    <RuioIcon
      onClick={handleClick}
      buttonClassName={`
        ${buttonStyles['ruio-btn']}
        ${buttonStyles['ruio-btn-secondary']}
        ${ruioEnabled ? buttonStyles['ruio-element-select-btn-active'] : buttonStyles['ruio-element-select-btn-inactive']}
      `}
      svgClassName={`${svgStyles['ruio-svg']} ${svgStyles['ruio-element-select-svg']}`}
    >
      <>
        <path
          className={`${svgStyles['ruio-outline']} ruio-exclude`}
          d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
          strokeWidth="1.5"
        />
        <path
          className={`${svgStyles['ruio-mouse-pointer']} ruio-exclude`}
          d="M14.859 16.4999L12.3975 14.0385L11.6459 14.7902C10.8764 15.5597 10.4916 15.9444 10.0781 15.8536C9.66452 15.7628 9.47641 15.2522 9.10019 14.231L7.84544 10.8253C7.09492 8.78816 6.71966 7.7696 7.24463 7.24463C7.7696 6.71966 8.78816 7.09492 10.8253 7.84544L14.231 9.10019C15.2522 9.47641 15.7628 9.66451 15.8536 10.0781C15.9444 10.4916 15.5597 10.8764 14.7902 11.6459L14.0385 12.3975L16.4999 14.859C16.7548 15.1138 16.8822 15.2413 16.9411 15.3834C17.0196 15.573 17.0196 15.7859 16.9411 15.9755C16.8822 16.1176 16.7548 16.2451 16.4999 16.4999C16.2451 16.7548 16.1176 16.8822 15.9755 16.9411C15.7859 17.0196 15.573 17.0196 15.3834 16.9411C15.2413 16.8822 15.1138 16.7548 14.859 16.4999Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    </RuioIcon>
  )
}

export default ElementSelectIcon