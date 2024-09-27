import BaseModal from '@components/BaseModal'

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  // blah: string
}

function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile"
      footer={
        <>
          <button onClick={onClose}>Close</button>
          <button onClick={() => alert('Profile Updated')}>Save Changes</button>
        </>
      }
    >
      <div>
        <h3>Name</h3>
        <p>Email</p>
      </div>
    </BaseModal>
  )
}

export default SettingsModal
