import { forwardRef, CSSProperties, ReactNode } from 'react'
import styles from './Tooltip.module.css'

interface TooltipProps {
  x: number
  y: number
  children: ReactNode
  style?: CSSProperties
  className?: string
}

/**
 * Base tooltip component that handles positioning and styling
 *
 * Features:
 * - Positioned absolutely at x,y coordinates
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
