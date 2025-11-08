import React from 'react'
import Comment from './Comment'

const CommentsSection: React.FC = () => {
  return (
    <section
      id="comments-section"
      className="comments-wrapper card"
      style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h2 className="comments-title section-heading" style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', color: '#1f2937' }}>
        Comments (3)
      </h2>

      <Comment
        author="Alex Chen"
        date="2 hours ago"
        content="Great article! I've been looking for a way to better visualize my React component structure. This is exactly what I needed."
        replies={[
          {
            author: 'Jane Developer',
            date: '1 hour ago',
            content: "Thanks Alex! Glad you found it helpful. Let me know if you have any questions!",
          },
        ]}
      />

      <Comment
        author="Sarah Martinez"
        date="5 hours ago"
        content="This technique has saved me so much debugging time. I can now quickly identify which components are rendering and their nesting levels."
      />

      <Comment
        author="Mike Johnson"
        date="1 day ago"
        content="I'd love to see a follow-up article about performance optimization when working with deeply nested component trees."
        replies={[
          {
            author: 'Jane Developer',
            date: '20 hours ago',
            content: 'Great suggestion! I\'ll add that to my writing queue.',
          },
          {
            author: 'Alex Chen',
            date: '18 hours ago',
            content: 'Yes please! Performance optimization is such an important topic.',
          },
        ]}
      />
    </section>
  )
}

export default CommentsSection
