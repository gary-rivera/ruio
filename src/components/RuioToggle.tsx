import React from 'react'
import '@styles/RuioToggle.css'

import { useRuioContext } from '../context/RuioContextProvider'

function RuioToggle(props: React.SVGProps<SVGSVGElement>) {
  const { ruioEnabled, setRuioEnabled } = useRuioContext()

  return (
    <div
      className="ruio-exclude ruio-toggle-container"
      onClick={() => {
        setRuioEnabled(!ruioEnabled)
        console.log('RuioToggle clicked', ruioEnabled)
      }}
    >
      <svg
        data-testid="ruio-toggle-icon"
        className="ruio-exclude ruio-logo"
        viewBox="0 0 313 234"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="313" height="234" rx="50" fill="#264653" />

        <svg
          x="35"
          y="29"
          width="243"
          height="176"
          viewBox="0 0 243 176"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M202.425 19.5556H40.5748C29.4014 19.5556 20.3435 28.3109 20.3435 39.1111V136.889C20.3435 147.689 29.4014 156.444 40.5748 156.444H72.5403V56.8272L77.3229 53.959C92.2899 44.9831 130.874 32.3035 166.984 53.959L167.405 54.2116L167.799 54.5029C173.92 59.0309 181.874 67.5177 184.303 78.5538C185.567 84.2978 185.293 90.6403 182.525 97.053C179.836 103.28 175.043 109.009 168.172 114.168C165.072 116.83 160.261 119.017 154.543 120.468C152.649 120.949 150.581 121.369 148.334 121.704L177.36 156.444H202.425C213.599 156.444 222.657 147.689 222.657 136.889V39.1111C222.657 28.3109 213.599 19.5556 202.425 19.5556ZM110.468 101.581L153.159 156.444H153.172L166.414 176H202.425C224.772 176 242.888 158.489 242.888 136.889V39.1111C242.888 17.5106 224.772 0 202.425 0H40.5748C18.2279 0 0.112183 17.5106 0.112183 39.1111V136.889C0.112183 158.489 18.2279 176 40.5748 176H72.5403H92.7716V156.444V68.0911C106.309 61.9255 132.118 56.3262 155.874 70.3124C159.643 73.2142 163.475 77.8988 164.514 82.6223C165.001 84.8357 164.9 87.0982 163.854 89.522C162.776 92.019 160.439 95.2646 155.503 98.9162L155.034 99.2631L154.614 99.6571C154.721 99.5567 154.718 99.5585 154.582 99.6351C154.184 99.8603 152.644 100.732 149.405 101.554C145.373 102.577 139.231 103.378 130.705 102.845L110.468 101.581Z"
            fill="#EAF8EF"
          />
        </svg>
      </svg>
    </div>
  )
}

export default RuioToggle
