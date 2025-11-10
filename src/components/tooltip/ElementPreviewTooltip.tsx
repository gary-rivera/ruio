import React from 'react'
import { PickerTooltipData } from '@hooks/useElementPicker'
import { Tooltip } from './Tooltip'
import { TooltipContent } from './TooltipContent'

interface ElementPreviewTooltipProps {
  data: PickerTooltipData | null
}

/**
 * Tooltip that follows the cursor during element picker mode.
 * Displays hovered elements metadata
 */
export const ElementPreviewTooltip: React.FC<ElementPreviewTooltipProps> = ({ data }) => {
  if (!data) return null

  return (
    <Tooltip x={data.x} y={data.y}>
      <TooltipContent data={data} />
    </Tooltip>
  )
}
