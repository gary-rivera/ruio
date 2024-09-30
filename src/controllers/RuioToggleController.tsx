import { useRuioContext } from '@root/context/RuioContextProvider'

import buttonStyles from '../styles/Button.module.css'
import divStyles from '../styles/Div.module.css'
import svgStyles from '../styles/SVG.module.css'

function RuioToggleController() {
  const { ruioEnabled, setRuioEnabled } = useRuioContext()

  return (
    <div className={`ruio-exclude ${divStyles['ruio-toggle-container']}`}>
      <button
        className={`
        ruio-exclude
        ${buttonStyles['ruio-btn']}
        ${buttonStyles['ruio-btn-primary']} ${ruioEnabled ? buttonStyles['ruio-logo-btn-enabled'] : buttonStyles['ruio-logo-btn-disabled']}`}
        onClick={() => {
          setRuioEnabled(!ruioEnabled)
        }}
      >
        <div
          className={`${divStyles['ruio-logo-div']} ${ruioEnabled ? divStyles['ruio-logo-div-active'] : divStyles['ruio-logo-div-inactive']}`}
        >
          <svg
            className={`ruio-exclude ${svgStyles['ruio-logo-svg']}`}
            viewBox="0 0 208 176"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M173.242 19.5556H35.2418C25.7149 19.5556 17.9918 28.3109 17.9918 39.1111V136.889C17.9918 147.689 25.7149 156.444 35.2418 156.444H59.4968V56.8272L63.5747 53.959C76.3361 44.9831 109.235 32.3035 140.023 53.959L140.382 54.2116L140.718 54.5029C145.937 59.0309 152.719 67.5177 154.79 78.5538C155.868 84.2978 155.634 90.6403 153.274 97.053C150.981 103.28 146.895 109.009 141.036 114.168C138.393 116.83 134.291 119.017 129.416 120.468C127.801 120.949 126.037 121.369 124.122 121.704L148.87 156.444H173.242C182.769 156.444 190.492 147.689 190.492 136.889V39.1111C190.492 28.3109 182.769 19.5556 173.242 19.5556ZM91.8352 101.581L128.236 156.444H128.247L139.537 176H173.242C192.296 176 207.742 158.489 207.742 136.889V39.1111C207.742 17.5106 192.296 0 173.242 0H35.2418C16.188 0 0.741821 17.5106 0.741821 39.1111V136.889C0.741821 158.489 16.188 176 35.2418 176H59.4968H76.7468V156.444V68.0911C94.0474 58.8496 133.144 57.18 137.918 82.6223C138.333 84.8357 138.246 87.0982 137.354 89.522C135.26 95.2123 130.644 99.8841 125.035 101.554C121.597 102.577 116.36 103.378 109.091 102.845L91.8352 101.581Z"
            />
          </svg>
        </div>
      </button>
      <div
        className={`${divStyles['ruio-logo-div-bg']} ${ruioEnabled ? divStyles['ruio-logo-div-bg-active'] : divStyles['ruio-logo-div-bg-inactive']}`}
      />
    </div>
  )
}

export default RuioToggleController
