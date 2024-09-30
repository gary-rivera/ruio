import { ReactNode } from 'react'

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  footer?: ReactNode
}

function SettingsModal({ isOpen, onClose, title, footer }: SettingsModalProps) {
  if (!isOpen) return null

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        backgroundColor: 'black',
        color: 'white',
        maxWidth: '300px',
        maxHeight: '150px',
        outline: '1px solid red',
        padding: '20px',
        borderRadius: '10px',
        position: 'relative',
      }}
    >
      <section style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: '0px' }}> depth</h3>
          <span> depth controls</span>
        </div>
        {/* <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: '0px' }}> theme</h3>
          <span> theme controls</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: '0px' }}> outline</h3>
          <span> outline controls</span>
        </div> */}
      </section>
      <footer style={{ alignSelf: 'end' }}>
        <button onClick={onClose}>close</button>
      </footer>
    </div>
  )
}

export default SettingsModal
