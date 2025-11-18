import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerServiceWorker } from './workers/sw-registration'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

if (import.meta.env.PROD) {
  registerServiceWorker()
} else if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(() => {
    console.log('Service Worker ready in development')
  })
}
