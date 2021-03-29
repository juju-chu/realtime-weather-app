import { StrictMode } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import './index.css'

import App from './App'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
)

serviceWorker.register()
