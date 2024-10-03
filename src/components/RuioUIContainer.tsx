import React, { forwardRef, useEffect } from 'react'
import RuioToggleController from '../controllers/RuioToggleController'
import { useRuioContext } from '@root/context/RuioContextProvider'

import divStyles from '../styles/Div.module.css'
import SettingsIcon from '@components/icons/SettingsIcon'
import ElementSelectIcon from '@components/icons/ElementSelectIcon'
import '../styles/globals.css'

interface RuioUIContainerProps {
  // NOTE: define as needed
}

function RuioUIContainer(props: RuioUIContainerProps, ref: React.Ref<HTMLDivElement>) {
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
