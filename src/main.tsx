import React from 'react'
import ReactDOM from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      storagePrefixes={["moving-motivators:", "mm_"]}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
