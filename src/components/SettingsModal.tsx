import { ReactNode } from 'react'

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  footer?: ReactNode
  position: { bottom: number; right: number }
}

function SettingsModal({ isOpen, onClose, position, title, footer }: SettingsModalProps) {
  if (!isOpen) return null
  console.log('received position values: ', {
    bottom: position.bottom,
    right: position.right,
  })
  return (
    <div
      className="yurrr"
      style={{
        display: 'flex',
        backgroundColor: 'black',
        color: 'white',
        maxWidth: '300px',
        width: '300px',
        maxHeight: '150px',
        height: '125px',
        outline: '1px solid red',
        padding: '20px',
        borderRadius: '10px',
        position: 'absolute',
        bottom: `${position.bottom}px`, // Ensure px is specified
        right: `${position.right}px`, // Ensure px is specified
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
