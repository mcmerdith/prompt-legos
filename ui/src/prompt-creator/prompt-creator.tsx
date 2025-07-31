import React from 'react'

import './prompt-creator.scss'

// Create a React component for the tab content
export default function PromptCreator() {
  const [count, setCount] = React.useState(0)

  return (
    <div id="prompt-creator-container">
      <h3>React Example Bottom Panel</h3>
      <p>This is a demo of the Bottom Panel Tabs API.</p>
      <p>Count: {count}</p>
      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: '8px 12px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Increment
      </button>
    </div>
  )
}
