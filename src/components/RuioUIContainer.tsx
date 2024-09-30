import React, { forwardRef, useEffect } from 'react'
import RuioToggleController from '../controllers/RuioToggleController'
import { applyOutlineUI } from '@utils/applyOutlineUI'
import { useRuioContext } from '@root/context/RuioContextProvider'

import divStyles from '../styles/Div.module.css'
import SettingsIcon from '@assets/SettingsIcon'
import ElementSelectIcon from '@assets/ElementSelectIcon'

interface RuioUIContainerProps {
  // NOTE: define as needed
}

function RuioUIContainer(props: RuioUIContainerProps, ref: React.Ref<HTMLDivElement>) {
  const { depth, ruioEnabled, parentAppRootElement, selectedRootElement } = useRuioContext()

  return (
    <div
      ref={ref}
      data-testid="ruio-ui-container"
      className={`
        ruio-exclude
        ${divStyles['ruio-ui-container']}
      `}
    >
      {/* all ruio components are lazy-loaded, css controls respective render effects */}
      <RuioToggleController />
      <ElementSelectIcon />
      <SettingsIcon />
    </div>
  )
}

export default forwardRef<HTMLDivElement, RuioUIContainerProps>(RuioUIContainer)
