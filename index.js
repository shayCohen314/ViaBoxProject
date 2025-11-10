/*
- Import React and ReactDOM
- Import routing component BrowserRouter
- Import main App component
- Render App inside BrowserRouter and React.StrictMode at root DOM node
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);