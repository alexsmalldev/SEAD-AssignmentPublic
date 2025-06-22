import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// need to remove strict mode on prod, causes useEffect to call twice

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
