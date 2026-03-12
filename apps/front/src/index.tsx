import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.scss'

import Main from './main'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
)
