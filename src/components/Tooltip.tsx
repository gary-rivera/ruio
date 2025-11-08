import React, { forwardRef, CSSProperties, ReactNode } from 'react'
import styles from './Tooltip.module.css'

interface TooltipProps {
  /**
   * The x-coordinate for the tooltip position (in pixels)
   */
  x: number
  /**
   * The y-coordinate for the tooltip position (in pixels)
   */
  y: number
  /**
   * Content to render inside the tooltip
   */
  children: ReactNode
  /**
   * Additional CSS properties to apply to the tooltip
   */
  style?: CSSProperties
  /**
   * Additional class name(s) to apply to the tooltip
   */
  className?: string
}

/**
 * Base tooltip component that handles positioning and styling.
 * Used as a foundation for all tooltip variants (element metrics, info tooltips, etc.)
 *
 * Features:
 * - Positioned absolutely at x,y coordinates
 * - Styled with ruio tooltip theme
 * - Pointer events disabled by default
 * - High z-index to appear above other content
 *
 * @example
 * // Simple tooltip at cursor position
 * <Tooltip x={100} y={200}>
 *   <div>Tooltip content</div>
 * </Tooltip>
 *
 * @example
 * // Tooltip with custom styling
 * <Tooltip x={100} y={200} style={{ transform: 'none' }}>
 *   <TooltipContent data={data} />
 * </Tooltip>
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ x, y, children, style, className }, ref) => {
    return (
      <div
        ref={ref}
        className={className ? `${styles.tooltip} ${className}` : styles.tooltip}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          ...style,
        }}
      >
        {children}
      </div>
    )
  },
)

Tooltip.displayName = 'Tooltip'
