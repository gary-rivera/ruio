import React, { ReactNode } from 'react'
// import styles from './BaseModal.module.css'

type BaseModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
}

function BaseModal({ isOpen, onClose, title, children, footer }: BaseModalProps) {
  if (!isOpen) return null

  return (
    <div
      style={{ width: '75px', height: '40px', backgroundColor: '#eaf8ef', border: '1px solid #eaf8ef' }}
    >
      <header>{title}</header>
      <section>{children}</section>
      {footer && <div>{footer}</div>}
    </div>
  )
}

export default BaseModal
