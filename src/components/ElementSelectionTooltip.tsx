import React from 'react'
import { PickerTooltipData } from '@hooks/useElementPicker'
import { Tooltip } from './Tooltip'
import { TooltipContent } from './TooltipContent'

interface ElementSelectionTooltipProps {
  data: PickerTooltipData | null
}

/**
 * Tooltip that follows the cursor during element picker mode.
 * Displays component name, depth, and selector information for debugging.
 */
export const ElementSelectionTooltip: React.FC<ElementSelectionTooltipProps> = ({ data }) => {
  if (!data) return null

  return (
    <Tooltip x={data.x} y={data.y}>
      <TooltipContent data={data} />
    </Tooltip>
  )
}
