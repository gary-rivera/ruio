import React from 'react'

interface CommentProps {
  author: string
  date: string
  content: string
  replies?: Array<{ author: string; date: string; content: string }>
}

const Comment: React.FC<CommentProps> = ({ author, date, content, replies }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div
        style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#1f2937' }}>{author}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{date}</div>
          </div>
        </div>
        <p style={{ margin: 0, color: '#374151', fontSize: '0.875rem', lineHeight: '1.6' }}>{content}</p>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem' }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              fontSize: '0.75rem',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Reply
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: '0.75rem',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Like
          </button>
        </div>
      </div>

      {/* Nested Replies */}
      {replies && replies.length > 0 && (
        <div style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
          {replies.map((reply, index) => (
            <Comment key={index} author={reply.author} date={reply.date} content={reply.content} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Comment
