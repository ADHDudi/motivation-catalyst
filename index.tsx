import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase for localhost development
// In production, Firebase Hosting provides credentials via /__/firebase/init.js
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  if (typeof window.firebase !== 'undefined' && window.firebase.apps && window.firebase.apps.length === 0) {
    window.firebase.initializeApp(firebaseConfig);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);