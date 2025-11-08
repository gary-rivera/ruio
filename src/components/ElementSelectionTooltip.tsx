import React from 'react'
import { TooltipData } from '@hooks/useElementSelection'
import { Tooltip } from './Tooltip'
import { TooltipContent } from './TooltipContent'

interface ElementSelectionTooltipProps {
  data: TooltipData | null
}

/**
 * Tooltip that follows the cursor during element selection mode.
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
