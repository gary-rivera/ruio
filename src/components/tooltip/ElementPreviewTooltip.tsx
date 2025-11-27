import React from 'react'
import { PickerTooltipData } from '@hooks/useElementPicker'
import { Tooltip } from './Tooltip'
import { TooltipContent } from './TooltipContent'

interface ElementPreviewTooltipProps {
  data: PickerTooltipData | null
}

/**
 * presentational component that sends coordinates to consumer (ElementPicker)
 * - displays the metadata of a hovered element
 * - positioning (following cursor) handled by ElementPicker
 */
export const ElementPreviewTooltip: React.FC<ElementPreviewTooltipProps> = ({ data }) => {
  if (!data) return null

  return (
    <Tooltip x={data.x} y={data.y}>
      <TooltipContent data={data} />
    </Tooltip>
  )
}
