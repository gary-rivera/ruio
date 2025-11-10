import React from 'react'
import { PickerTooltipData } from '@hooks/useElementPicker'
import styles from './Tooltip.module.css'

interface TooltipContentProps {
  data: Omit<PickerTooltipData, 'x' | 'y'>
}

/**
 * Shared tooltip content component that renders the actual tooltip information.
 * Used by both ElementSelectionTooltip and PersistedElementTooltip.
 */
export const TooltipContent: React.FC<TooltipContentProps> = ({ data }) => {
  const depthText = data.depth === 'MAX_DEPTH_EXCEEDED' ? 'MAX_DEPTH_EXCEEDED' : `${data.depth}`

  const componentInfoAvailable =
    data.reactComponentName || data.parentComponentName || data.firstChildComponentName

  return (
    <>
      {/* React Component Info */}
      {componentInfoAvailable && (
        <>
          {data.reactComponentName && (
            <div className={styles.row}>
              <span className={styles.label}>component:</span>
              <span className={styles.value}>{data.reactComponentName}</span>
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
        <span className={styles.label}>current_depth:</span>
        <span className={styles.value}>{data.currentDepth}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>children:</span>
        <span className={styles.value}>{data.childrenCount}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>siblings:</span>
        <span className={styles.value}>{data.siblingsCount}</span>
      </div>
    </>
  )
}
