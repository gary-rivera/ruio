import React from 'react'
import { TooltipData } from '@hooks/useElementSelection'
import styles from './ElementSelectionTooltip.module.css'

interface ElementSelectionTooltipProps {
  data: TooltipData | null
}

/**
 * Tooltip that follows the cursor during element selection mode.
 * Displays component name, depth, and selector information for debugging.
 */
export const ElementSelectionTooltip: React.FC<ElementSelectionTooltipProps> = ({ data }) => {
  if (!data) return null

  const depthText =
    data.depth === 'MAX_DEPTH_EXCEEDED' ? 'MAX_DEPTH_EXCEEDED' : `${data.depth}`

  const componentInfoAvailable =
    data.reactComponentName || data.parentComponentName || data.firstChildComponentName

  return (
    <div
      className={styles.tooltip}
      style={{
        left: `${data.x}px`,
        top: `${data.y}px`,
      }}
    >
      {/* React Component Info */}
      {componentInfoAvailable && (
        <>
          {data.reactComponentName && (
            <div className={styles.row}>
              <span className={styles.label}>component:</span>
              <span className={styles.value}>{data.reactComponentName}</span>
            </div>
          )}
          {data.parentComponentName && (
            <div className={styles.row}>
              <span className={styles.label}>parent_component:</span>
              <span className={styles.value}>{data.parentComponentName}</span>
            </div>
          )}
          {data.firstChildComponentName && (
            <div className={styles.row}>
              <span className={styles.label}>child_component:</span>
              <span className={styles.value}>{data.firstChildComponentName}</span>
            </div>
          )}
          <div className={styles.divider} />
        </>
      )}

      {/* HTML/CSS Info */}
      <div className={styles.row}>
        <span className={styles.label}>tag:</span>
        <span className={styles.value}>{data.tagName}</span>
      </div>
      {data.parentTag && (
        <div className={styles.row}>
          <span className={styles.label}>parent_tag:</span>
          <span className={styles.value}>{data.parentTag}</span>
        </div>
      )}
      {data.firstChildTag && (
        <div className={styles.row}>
          <span className={styles.label}>child_tag:</span>
          <span className={styles.value}>{data.firstChildTag}</span>
        </div>
      )}
      <div className={styles.row}>
        <span className={styles.label}>selector:</span>
        <span className={styles.value}>{data.selector}</span>
      </div>

      <div className={styles.divider} />

      {/* Metrics */}
      <div className={styles.row}>
        <span className={styles.label}>max_depth:</span>
        <span className={styles.value}>{depthText}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>children:</span>
        <span className={styles.value}>{data.childrenCount}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>siblings:</span>
        <span className={styles.value}>{data.siblingsCount}</span>
      </div>
    </div>
  )
}
