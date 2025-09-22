import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = '653403210426-11n2rnnnlo8rd2b1i85ujmgh8nv8ci06.apps.googleusercontent.com'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <GoogleOAuthProvider clientId={CLIENT_ID}>
  <App />
</GoogleOAuthProvider>
  </StrictMode>,
)
