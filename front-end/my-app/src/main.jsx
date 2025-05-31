import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-blue/theme.css'; // Best default theme
import 'primereact/resources/primereact.min.css';               // Core PrimeReact styles
import 'primeicons/primeicons.css';                             // Icons (optional but useful)
import 'primeflex/primeflex.css';        

import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
