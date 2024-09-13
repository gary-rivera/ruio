// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BorderDebuggerProvider } from './context/BorderDebuggerContext';

ReactDOM.render(
  <React.StrictMode>
    <BorderDebuggerProvider>
      <App />
    </BorderDebuggerProvider>
  </React.StrictMode>,
  document.getElementById('root')
);