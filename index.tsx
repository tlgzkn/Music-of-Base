import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

try {
  console.log("Mounting App...");
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to render app:", error);
  
  // Render fallback UI with error details
  rootElement.innerHTML = `
    <div style="
      color: #e2e8f0; 
      background-color: #0f172a; 
      height: 100vh; 
      padding: 40px; 
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    ">
      <h1 style="color: #ef4444; margin-bottom: 20px;">Application Error</h1>
      <p style="margin-bottom: 20px; font-size: 1.1rem;">Failed to load the application.</p>
      <pre style="
        background: #1e293b; 
        padding: 20px; 
        border-radius: 8px; 
        overflow: auto; 
        max-width: 800px; 
        width: 100%;
        text-align: left;
        border: 1px solid #334155;
        color: #94a3b8;
      ">${error instanceof Error ? error.stack : String(error)}</pre>
      <button onclick="window.location.reload()" style="
        margin-top: 30px;
        padding: 10px 24px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 999px;
        font-weight: bold;
        cursor: pointer;
      ">
        Reload App
      </button>
    </div>
  `;
}