import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const container = document.getElementById('root')!
const tree = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Production HTML is prerendered by scripts/prerender.mjs, so there is markup to
// adopt; the dev server serves an empty shell, so there is not.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
