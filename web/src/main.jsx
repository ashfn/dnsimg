import * as React from 'react';


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <title>dnsimg</title>
    <meta name="description" content="dnsimg is a tool that allows you to download images from a domain" />
    <meta name="keywords" content="dnsimg, dns, image, download, domain" />
    <meta name="author" content="dnsimg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow" />
    <meta name="google" content="notranslate" />
    <meta name="google" content="notranslate" />
    <StrictMode>

    <App />
  </StrictMode>
  </React.Fragment>
)
