import { ReactNode } from 'react'

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  footer?: ReactNode
  position: { right: number; bottom: number }
}

function SettingsModal({ isOpen, onClose, position, title, footer }: SettingsModalProps) {
  if (!isOpen) return null
  console.log('[SettingsModal] received coordinates: ', {
    right: position.right,
    bottom: position.bottom,
    offsetRight: position.right - 20,
    offsetBottom: position.bottom - 20,
  })
  return (
    <div
      className="ruio-exclude"
      style={{
        display: 'flex',
        backgroundColor: 'black',
        color: 'white',
        maxWidth: '300px',
        width: '300px',
        maxHeight: '150px',
        height: '125px',
        padding: '20px',
        borderRadius: '10px',
        position: 'absolute',
        right: '34px', // dynamically adjust to be iconRef.width/height + ~10px
        bottom: '34px', // dynamically adjust to be iconRef.width/height + ~10px
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